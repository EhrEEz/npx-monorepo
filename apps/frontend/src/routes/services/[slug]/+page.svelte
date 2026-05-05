<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ServiceApplication, Service } from '$backend/src/payload-types.js';
	import ResponsiveImage from '$lib/components/Image/ResponsiveImage.svelte';
	import { ScrollSmoother } from 'gsap/ScrollSmoother';
	import Tag from '$lib/components/Tag/Tag.svelte';
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { getContext } from 'svelte';

	type SmoothType = { smooth: ScrollSmoother | null };
	const smoothInstance = $derived<ScrollSmoother | null>(getContext<SmoothType>('smooth').smooth);
	const { data } = $props();
	const service = $derived<Service>(data.service);
	const applications = $derived<ServiceApplication[]>(
		service.relatedInners?.docs as ServiceApplication[]
	);

	let applicationSection = $state<HTMLElement>();
	let applicationNav = $state<HTMLElement>();
	let ctx: gsap.Context | null = null;
	let applicationElements = $state<HTMLLIElement[]>([]);
	let currentApplicationIndex = $state(0);

	function initNavPin() {
		if (!browser) return;
		if (window.innerWidth < 768) return;
		if (!applicationSection || !applicationNav) return;

		ctx?.revert();

		ctx = gsap.context(() => {
			ScrollTrigger.create({
				trigger: applicationSection,
				scroller: '#smooth-wrapper',
				start: 'top 200px',
				end: 'bottom bottom',
				pin: applicationNav,
				pinSpacing: false,
				id: 'application-pin'
			});

			const mm = gsap.matchMedia();
			mm.add('(min-width:992px)', () => {
				applicationElements.forEach((emt) => {
					ScrollTrigger.create({
						trigger: emt,
						start: 'top 20%',
						end: 'bottom 20%',
						toggleActions: 'play pause resume reverse',
						onEnter: () => {
							const data = emt.getAttribute('data-item-index');
							currentApplicationIndex = parseInt(data as string);
						},

						onEnterBack: () => {
							const data = emt.getAttribute('data-item-index');
							currentApplicationIndex = parseInt(data as string);
						}
					});
				});
			});
		});
	}

	function onPageReady() {
		initNavPin();
	}

	function scrollToApplication(index: number) {
		currentApplicationIndex = index;
		smoothInstance?.scrollTo(`#application-${index + 1}`, true, 'top 19%');
	}

	$inspect(service);
	$effect(() => {
		if (!browser) return;

		gsap.registerPlugin(ScrollTrigger);

		// Wait for page-ready so ScrollTrigger has correct measurements
		window.addEventListener('page-ready', onPageReady);
		return () => {
			window.removeEventListener('page-ready', onPageReady);
			ctx?.revert();
			ctx = null;
		};
	});

	onDestroy(() => {
		ctx?.revert();
		ctx = null;
	});
</script>

<section data-section="dark" class="service__title-section pt-xl-8 pb-xl-9 pt-4 pb-6">
	<div class="mb-5">
		<a href={resolve('/services')} class="pretty-link" aria-label="Back to Articles">
			<span class="btn__wrapper">
				<span class="btn__icon"
					><svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4 7H15C16.3261 7 17.5979 7.52678 18.5355 8.46447C19.4732 9.40215 20 10.6739 20 12C20 13.3261 19.4732 14.5979 18.5355 15.5355C17.5979 16.4732 16.3261 17 15 17M4 7L7 4M4 7L7 10M8 17H11"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span><span class="btn__text">All Services </span></span
			>
		</a>
	</div>
	<div class="grid-xl-row col-gap-1 col-gap-md-2 col-gap-lg-3 col-gap-xl-4 al-center">
		<div class="col-start-lg-3 col-end-lg-7">
			<div class="service__cover">
				{#if typeof service.cover != 'number'}
					<ResponsiveImage image={service.cover} alternate_alt={service.name} loading="eager" />
				{/if}
			</div>
		</div>
		<div class="col-start-lg-8 col-end-lg-13">
			<h1 class="heading-4 service__title"><span class="sr-only"></span> {service.name}</h1>
		</div>
		<div class="col-start-lg-3 col-end-lg-7 mt-3">
			<p class="font-mono regular-20 uppercase service__description">
				Creative design solutions that define your brand and elevate digital experiences.
			</p>
		</div>
	</div>
</section>
<section
	data-section="dark"
	class="service__application-section pb-4 pb-md-6 pb-xl-9"
	bind:this={applicationSection}
>
	<div class="grid-lg-row col-gap-1 col-gap-md-2 col-gap-lg-3 col-gap-xl-4">
		<nav
			class="col-lg-2 application__navigation"
			aria-label="Application Navigation"
			bind:this={applicationNav}
		>
			<ul class="strip-style fl-col gap-1 application__navigation">
				{#each applications as application, index (applications.indexOf(application))}
					<li class="application__item">
						<button
							class="font-mono uppercase application__navigation-link"
							class:active={index === currentApplicationIndex}
							onclick={() => scrollToApplication(index)}>{application.name}</button
						>
					</li>
				{/each}
			</ul>
			<div class="fl-row mt-4">
				<a href={resolve('/contact')} class="circle__link strip-style btn--accent">
					<span class="btn__wrapper"
						><span class="btn__text bold-32 font-mono uppercase">Let's Talk</span></span
					>
				</a>
			</div>
		</nav>
		<ul class="strip-style col-lg-10 application__list" aria-label={`${service.name} Applications`}>
			{#each applications as application, index (applications.indexOf(application))}
				<li
					class="application__row"
					id="application-{application.id}"
					data-item-index={index}
					bind:this={applicationElements[index]}
				>
					<div class="application__content pb-2 pb-md-8">
						<h2 class="about-title mb-1">{application.name}</h2>
						<p class="neutral-300 mb-3 mb-lg-4">
							{application.description}
						</p>
						<ul class="strip-style fl-col gap-2" aria-label={`${application.name} Offerings`}>
							{#each application.offerings as offering (offering.id)}
								<li>
									<h3 class="regular-15 uppercase font-mono mb-1">
										{offering.name}
									</h3>
									<ul
										class="strip-style fl-row gap-1 fl-wrap"
										aria-label={`${offering.name} Examples`}
									>
										{#each offering.examples as example (example.id)}
											<li>
												<Tag
													variant="mix"
													color="mix-accent"
													class="medium-12 uppercase tag--narrow"
													size="small">{example.name}</Tag
												>
											</li>
										{/each}
									</ul>
								</li>
							{/each}
						</ul>
					</div>
					<div class="application__carousel">
						{#if application.images}
							{#each application.images as image (typeof image === 'number')}
								{JSON.stringify(image)}
							{/each}
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style lang="scss">
	.about-title {
		font-feature-settings:
			'ss01' on,
			'ss02' on;
		font-family: 'Space Mono';
		font-style: normal;
		font-weight: 400;
		line-height: 122%;
		text-transform: uppercase;
		text-wrap: balance;

		&-wrapper {
			display: grid;
			align-items: center;
		}
	}
	.application {
		&__navigation {
			&-link {
				color: var(--clr-neutral-400);
				&.active {
					&,
					&:hover {
						color: var(--clr-neutral-100);
					}
				}
			}
		}
		&__item {
			--_color: var(--clr-neutral-500);
			color: var(--_color);

			:global(a) {
				color: var(--_color);
			}

			&:hover {
				--_color: var(--clr-neutral-300);
			}
		}
		&__row,
		&__list {
			display: grid;
			grid-template-columns: subgrid;
			grid-column: span 10;
		}
		&__content {
			grid-column: span 4;
		}
		&__carousel {
			grid-column: 6 / 12;
		}
	}
	.service {
		&__cover {
			:global(img) {
				border-radius: 0.8rem;
				aspect-ratio: 16 / 5;
				object-fit: cover;
			}
		}
		&__title {
			letter-spacing: 0.1em;
		}
		&__description {
			line-height: 1.22;
		}
	}
</style>
