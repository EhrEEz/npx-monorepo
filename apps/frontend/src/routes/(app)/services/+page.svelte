<script lang="ts" module>
	import { resolve } from '$app/paths';
	import type { Media } from '$backend/src/payload-types';
	import Carousel from '$lib/components/carousel/Carousel.svelte';
	import Image from '$lib/components/Image/Image.svelte';

	export type ServiceItem = {
		id: number | string;
		name: string;
		label?: string;
	};
	export type ServiceType = {
		id: number | string;
		name: string;
		label?: string;
		description: string;
		slug: string;
		inner_list: ServiceItem[];
		images?: Media[] | string[];
		cover: Media | string;
	};
</script>

<script lang="ts">
	const allServices: ServiceType[] = [
		{
			id: 1,
			name: 'Design',
			label: 'Design',
			slug: 'design',
			description:
				'We create cohesive brand systems and intuitive digital experiences that elevate how your business is perceived across every touchpoint.',
			inner_list: [
				{ id: 1, name: 'Branding & Visual Identity' },
				{ id: 2, name: 'UI/UX Design' },
				{ id: 3, name: 'Digital & Print Media' }
			],
			images: [
				`https://picsum.photos/seed/${Math.floor(Math.random() * 100)}/420/280`,
				`https://picsum.photos/seed/${Math.floor(Math.random() * 100)}/420/280`,
				`https://picsum.photos/seed/${Math.floor(Math.random() * 100)}/420/280`
			],
			cover: `https://picsum.photos/seed/${Math.floor(Math.random() * 100)}/420/280`
		},
		{
			id: 2,
			name: 'Development',
			label: 'Development',
			slug: 'development',
			description:
				'Our engineering team builds high-performance digital products using modern frameworks, scalable architecture, and efficient development practices.',
			inner_list: [
				{ id: 1, name: 'Web Development' },
				{ id: 2, name: 'Mobile App Development' },
				{ id: 3, name: 'Software Development' },
				{ id: 4, name: 'Tech Stack Expertise' }
			],
			images: [],
			cover: `https://picsum.photos/seed/${Math.floor(Math.random() * 100)}/420/280`
		},
		{
			id: 3,
			name: 'cloud and data',
			label: 'Cloud & Data Services',
			slug: 'cloud-and-data',
			description:
				'We design and manage secure, resilient, and globally optimized cloud environments that ensure high availability and operational excellence.',
			inner_list: [
				{ id: 1, name: 'Branding & Visual Identity' },
				{ id: 2, name: 'UI/UX Design' },
				{ id: 3, name: 'Digital & Print Media' }
			],
			images: [],
			cover: `https://picsum.photos/seed/${Math.floor(Math.random() * 100)}/420/280`
		},
		{
			id: 4,
			name: 'marketing',
			label: 'Marketing',
			slug: 'marketing',
			description:
				'We execute data-driven marketing strategies that improve visibility, accelerate acquisition, and enhance long-term customer engagement.',
			inner_list: [
				{ id: 1, name: 'Growth Hacking' },
				{ id: 2, name: 'Search & Performance Marketing' },
				{ id: 3, name: 'Social Media Marketing' },
				{ id: 4, name: 'Content & Brand Marketing' },
				{ id: 5, name: 'Analytics & Reporting' }
			],
			images: [],
			cover: `https://picsum.photos/seed/${Math.floor(Math.random() * 100)}/420/280`
		},
		{
			id: 5,
			name: 'expert',
			label: 'Expert Services',
			slug: 'expert-services',
			description:
				'Our strategic and operational support ensures that every digital initiative is planned, executed, and maintained with precision and clarity.',
			inner_list: [{ id: 1, name: 'Consulting & Support' }],
			images: [],
			cover: `https://picsum.photos/seed/${Math.floor(Math.random() * 100)}/420/280`
		}
	];
	const services = $derived(allServices);
</script>

<section data-section="dark" class="page__title-section mt-xl-9 mt-9 mb-4">
	<div class="grid-xl-row al-lg-end">
		<div class="col-lg-5 col-xl-4">
			<h1 class="heading-1 mb-2" id="pageTitle">Our Services</h1>
			<div class="fl-row fl-wrap gap-1 al-center">
				<a
					href="https://drive.google.com/uc?export=download&id=1x1kVPoeZaI9VFPjU6xvle9SePYs8-nWH"
					class="btn--primary services__button btn--small"
					target="_blank"
				>
					<span class="btn__wrapper">
						<span class="btn__text">Download Full Brochure</span>
					</span>
				</a>
				<a
					href="https://drive.google.com/uc?export=download&id=1x1kVPoeZaI9VFPjU6xvle9SePYs8-nWH"
					class="btn--primary btn--outline services__button btn--small"
					target="_blank"
				>
					<span class="btn__wrapper">
						<span class="btn__text">Download Summary</span>
					</span>
				</a>
			</div>
		</div>
		<div class="col-start-lg-11 col-start-xl-12 col-end-lg-13">
			<div class="fl-row jc-end">
				<a href={resolve('/contact')} class="circle__link strip-style btn--accent">
					<span class="btn__wrapper"
						><span class="btn__text bold-32 font-mono uppercase">Let's Talk</span></span
					>
				</a>
			</div>
		</div>
	</div>
</section>
<section class="services__list-section my-4 my-xl-5 pb-lg-8" data-section="dark">
	<ol class="services__list">
		{#each services as service, index (service.id)}
			<li class="services__item strip-style">
				<div class="grid-md-row {index === 0 ? 'mb-md-6 mb-lg-7' : 'my-md-6 my-lg-7'}">
					<div class="services__cover w-full">
						{#if typeof service.cover === 'string'}
							<img src={service.cover} alt={service.name} />
						{:else}
							<Image image={service.cover} />
						{/if}
					</div>
				</div>
				<div class="grid-lg-row ai-end">
					<div class="col-start-lg-1 col-end-lg-5 h-full">
						<h2 class="heading-2">{service.label ? service.label : service.name}</h2>
						<p class="neutral-400 mt-2">
							We create cohesive brand systems and intuitive digital experiences that elevate how
							your business is perceived across every touchpoint.
						</p>
						<div class="fl-row fl-wrap al-center mt-2">
							<a
								href={resolve(`/services/${service.slug}`)}
								class="btn--primary btn--outline services__button btn--thin"
								target="_blank"
							>
								<span class="btn__wrapper">
									<span class="btn__text"
										><span class="neutral-200">Learn about our {service.name} services</span></span
									>
								</span>
							</a>
						</div>
					</div>
					<div class="col-start-lg-6 col-end-lg-10 h-full">
						<div class="h-full">
							<ol class="services__inner-list mb-3">
								{#each service.inner_list as inner_item (inner_item.id)}
									<li class="services__inner-item">
										<div class="fl-row jc-between al-center">
											<p class="font-mono regular-15 uppercase neutral-300">
												{inner_item.label ? inner_item.label : inner_item.name}
											</p>
											<div class="font-mono bold-15 neutreal-100" aria-hidden="true">
												{String(inner_item.id).padStart(2, '0')}
											</div>
										</div>
									</li>
								{/each}
							</ol>
							{#if service.images}
								<Carousel
									slides={[
										...service.images.map((emt, i) => {
											return {
												id: i,
												content: emt
											};
										})
									]}
								>
									{#snippet children({ slide, isActive })}
										<div class="slide" class:active={isActive}>
											{#if typeof slide.content === 'string'}
												<img src={slide.content} alt="{service.name} example" />
											{:else}
												<Image image={slide.content as Media} />
											{/if}
										</div>
									{/snippet}
								</Carousel>
							{/if}
						</div>
					</div>
					<div class="col-start-lg-10 col-end-lg-13" aria-hidden="true">
						<div class="services__counter heading-2 font-mono text-right" aria-hidden="true">
							{String(service.id).padStart(2, '0')}
						</div>
					</div>
				</div>
			</li>
		{/each}
	</ol>
</section>

<style lang="scss">
	.services {
		&__item {
			&:nth-child(6n + 1) {
				--grid-start: 3;
			}
			&:nth-child(6n + 2) {
				--grid-start: 8;
			}
			&:nth-child(6n + 3) {
				--grid-start: 1;
			}
			&:nth-child(6n + 4) {
				--grid-start: 5;
			}
			&:nth-child(6n + 5) {
				--grid-start: 6;
			}
			&:nth-child(6n + 6) {
				--grid-start: 9;
			}
			.services__cover {
				grid-column: var(--grid-start) / calc(var(--grid-start) + 4);
			}
		}
		&__cover {
			img {
				inline-size: 100%;
				border-radius: 1rem;
			}
		}
		&__counter {
			color: var(--clr-neutral-600);
			text-align: right;
			-webkit-text-stroke-width: 1px;
			-webkit-text-stroke-color: var(--clr-neutral-500);
			font-style: normal;
			font-weight: 800;
			line-height: 100%;
			text-transform: uppercase;
		}
		&__inner {
			&-list {
				list-style: none;
			}
			&-item {
				padding-block: 0.5em;
				border-block-end: 1px solid var(--clr-neutral-500);
			}
		}
	}

	.circle__link {
		inline-size: 100%;
		border-radius: 100%;
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		translate: 0 50%;
	}
</style>
