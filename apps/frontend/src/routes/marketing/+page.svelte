<script lang="ts">
	import { getContext } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Tag from '$lib/components/Tag/Tag.svelte';
	import Modal from '$lib/components/Modal/Modal.svelte';
	import '$lib/scss/styles.scss';
	import { useSlot } from '$lib/components/Slots/slots.svelte.js';
	import { onDestroy } from 'svelte';
	import Link from '$lib/components/Link/Link.svelte';
	const ACCESS_KEY = `5e3a9806-0470-49b0-ab74-d7109400cdc6`;
	const cleanupSlots = useSlot('fixed', whatsappButton);
	import type { SiteSetting } from '$backend/src/payload-types';

	const siteSettings = getContext<{ settings: SiteSetting }>('site-settings')
		.settings as SiteSetting;
	const siteInfo = $derived(siteSettings.basic_settings);
	const socials = $derived(siteSettings.social_media);

	type Validation = string | true;
	type ValidationFunction = (a: string) => Validation;

	function validateFullName(value: string): Validation {
		if (!value.trim() || value.trim().length <= 0) {
			return 'Full Name is required';
		}
		return true;
	}
	function validateCompanyName(value: string): Validation {
		if (value.trim() && value.trim().length < 2) {
			return 'Company Name must be at least 2 characters';
		}
		return true;
	}
	function validateEmail(value: string): Validation {
		if (!value.trim() || value.trim().length <= 0) {
			return 'Email is required';
		} else {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(value.trim())) {
				return 'Enter a valid email';
			}
		}
		return true;
	}
	function validatePhoneNumber(value: string): Validation {
		const phoneRegex = /^[0-9+\-\s()]{7,}$/;
		const trimmed = value.trim();

		if (trimmed.length > 0 && !phoneRegex.test(trimmed)) {
			return 'Enter a valid phone number.';
		}

		return true;
	}

	function validateMessage(value: string): Validation {
		const trimmed = value.trim();

		if (trimmed.length > 0 && trimmed.length < 5) {
			return 'Message must be at least 5 characters.';
		}

		if (trimmed.length > 500) {
			return 'Message must be at most 500 characters.';
		}

		return true;
	}
	class FormControl {
		value: string = $state('');
		error: boolean = $state(false);
		errorMessage: string = $state('');
		changed: boolean = $state(false);
		validationFunction: ValidationFunction = (): Validation => {
			return true;
		};

		constructor(config?: { value?: string; validate?: ValidationFunction } | undefined | null) {
			if (config && config.value) {
				this.value = config.value;
			}
			if (config && config.validate) {
				this.validationFunction = config.validate;
			}
			return this;
		}

		setValidation(fn: ValidationFunction) {
			this.validationFunction = fn;
		}

		validate() {
			const err = this.validationFunction.call(this, this.value);
			if (typeof err === 'string') {
				this.error = true;
				this.errorMessage = err;
			} else {
				this.error = false;
				this.errorMessage = '';
			}
			if (!this.changed) {
				this.changed = true;
			}
		}
	}

	let fullName = new FormControl({ validate: validateFullName });
	let companyName = new FormControl({ validate: validateCompanyName });
	let email = new FormControl({ validate: validateEmail });
	let phoneNumber = new FormControl({ validate: validatePhoneNumber });
	let message = new FormControl({ validate: validateMessage });

	const modal = {
		headerText: '',
		contentText: ''
	};

	const formData = $derived({
		phoneNumber: phoneNumber.value,
		fullName: fullName.value,
		companyName: companyName.value,
		email: email.value,
		message: message.value,
		source: 'Marketing',
		access_key: ACCESS_KEY
	});
	let showModal = $state(false);
	let showErrorInModal = $state(false);
	let validity = $derived(
		!fullName.error && !companyName.error && !email.error && !phoneNumber.error && !message.error
	);
	async function submitForm(event: SubmitEvent) {
		event.preventDefault();
		if (validity) {
			try {
				const res = await fetch('https://api.web3forms.com/submit', {
					method: 'post',
					body: JSON.stringify(formData),
					headers: {
						Accept: 'application/json',
						'Content-type': 'application/json'
					}
				});
				const json = await res.json();
				if (json.success) {
					modal.headerText = 'Your message has been submitted.';
					modal.contentText = "We've received your message and will get back to you very soon.";
					showModal = true;
					fullName.value = '';
					companyName.value = '';
					email.value = '';
					phoneNumber.value = '';
					message.value = '';
				} else {
					modal.headerText = `Error ${json.status}: ${json.message}`;
					modal.contentText = `${json.detail}`;
					showModal = true;
					showErrorInModal = true;
				}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (e: any) {
				console.error('Error:', e);
				modal.headerText = 'Network Error';
				modal.contentText = 'Unable to submit form. Please try again.';
				showModal = true;
			}
		}
	}
	gsap.registerPlugin(ScrollTrigger);

	onDestroy(cleanupSlots);
</script>

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17943724166"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());
		gtag('config', 'AW-17943724166');
	</script>
	<script>
		gtag('event', 'conversion', {
			send_to: 'AW-17943724166/5OJlCOXZ9vUbEIaBnuxC'
		});
	</script>
</svelte:head>

<section class="banner__section pt-6 pb-5">
	<div class="grid-row ai-center col-gap-1 row-gap-3 gap-md-4">
		<div class="col-12 col-md-8 col-lg-5 order-1 order-md-0">
			<div class="font-mono uppercase neutral-400 bold-15">Trusted Tech Partner</div>
			<h1 class="heading-3 my-1">
				Build your full remote team in Nepal at a fraction of the cost.
			</h1>
			<p class="accent-300 about-24">Build Your IT Team in Nepal</p>
			<p class="neutral-300 mt-1" style="max-width:50ch;">
				Nepaxis sets up and manages your dedicated remote team so you can scale fast, without the
				overhead of Western hiring.
			</p>
			<div class="fl-row fl-wrap al-center gap-1 my-3 my-lg-4">
				<Link href="#contact" class="btn--white" scrollTo="#contact">
					<span class="btn__wrapper"><span class="btn__text">Get Free Consultation</span></span>
				</Link>
				<Link href="#services" class="btn--outline btn--white" scrollTo="#services">
					<span class="btn__wrapper"><span class="btn__text">View Services</span></span>
				</Link>
			</div>
			<div class="fl-row fl-wrap gap-1 gap-md-2 al-center">
				<Tag
					variant="fill"
					color="accent"
					size="small"
					curvature="full"
					class="fl-row al-center jc-center gap-1"
					><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"
						><g fill="none" stroke="#000" stroke-width="2.5"
							><path stroke-linecap="round" d="M14 4L14 44" /><path
								d="M14.5 6C14.5 6 28 13 32 22C36 31 33 44 33 44"
							/><path stroke-linecap="round" stroke-linejoin="round" d="M4 44H44" /><path
								stroke-linecap="round"
								d="M10 15H32"
							/><path stroke-linecap="round" d="M14 22H22" /><path
								stroke-linecap="round"
								d="M14 29H26"
							/><path stroke-linecap="round" d="M14 36H27" /></g
						></svg
					>UAE Based</Tag
				>
				<Tag
					variant="fill"
					color="accent"
					size="small"
					curvature="full"
					class="fl-row al-center jc-center gap-1"
					><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linejoin="round"
							stroke-width="2.5"
							d="M19 4h18L26 18h15L17 44l5-19H8z"
						/></svg
					> Fast Delivery</Tag
				>
				<Tag
					variant="fill"
					color="accent"
					size="small"
					curvature="full"
					class="fl-row al-center jc-center gap-1"
					><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 45 45"
						><g
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							><path d="m24 40l12-12l-4 4l-4 4zm0 0L4 20L16 8l8 8" /><path
								d="M17 23L32 8l12 12l-8 8l-8-8l-6 6zm0 0l7-7m4 20l-3-3m7-1l-3-3"
							/></g
						></svg
					>Trusted Team</Tag
				>
			</div>
		</div>
		<div class="col-12 col-md-4 col-start-lg-7 col-end-lg-13 order-0 order-md-1">
			<div class="banner__img">
				<enhanced:img
					src="/static/images/marketing-banner-light.png"
					alt="Nepaxis Growth Formula"
				/>
			</div>
		</div>
	</div>
</section>
<section
	class="full-width content-grid why__section py-6 py-lg-9 bg-neutral-200"
	data-section="light"
>
	<h2 class="heading-2 text-center neutral-700 mb-3 mb-md-4">Why Choose Nepaxis</h2>
	<ul
		class="w-100 grid grid-template-col-ms-2 grid-template-col-lg-4 gap-1 gap-xl-1 px-xl-8 px-2xl-10"
	>
		<li class="card--why">
			<h3 class="heading-m-lg uppercase neutral-600 mb-1">Faster Operations</h3>
			<p class="neutral-400 regular-14 leading-150">
				Optimized digital workflows accelerating productivity and reducing cycle time.
			</p>
		</li>
		<li class="card--why">
			<h3 class="heading-m-lg uppercase neutral-600 mb-1">Secure Systems</h3>
			<p class="neutral-400 regular-14 leading-150">
				Hardened infrastructure ensuring data integrity and robust threat protection.
			</p>
		</li>
		<li class="card--why">
			<h3 class="heading-m-lg uppercase neutral-600 mb-1">Business Growth</h3>
			<p class="neutral-400 regular-14 leading-150">
				Scalable strategies driving revenue expansion and increased market share.
			</p>
		</li>
		<li class="card--why">
			<h3 class="heading-m-lg uppercase neutral-600 mb-1">Global Delivery</h3>
			<p class="neutral-400 regular-14 leading-150">
				Efficient distribution networks providing seamless international service and support.
			</p>
		</li>
	</ul>
</section>

<section class="services__section pt-6 pb-4 py-ms-6 py-lg-9" id="services" data-section="dark">
	<div class="fl-row jc-center al-center">
		<h2 class="sr-only">Our Services</h2>
		<Tag
			class="mb-3 mb-md-4 neutral-500"
			size="small"
			color="accent"
			variant="outline"
			aria-hidden="true">Our Services</Tag
		>
	</div>
	<ul class="strip-style grid-row gap-1 gap-xl-2">
		<li class="col-6 col-md-4 col-lg-3">
			<div class="card--market market__item">
				<div class="market__image">
					<picture>
						<img src="/images/service/branding-visual.png" alt="Corporate Identity Example" />
					</picture>
					<Tag class="market__tag" size="small" color="dark-grey">Design</Tag>
				</div>
				<div class="market__content">
					<h4 class="market__title font-mono regular-20 uppercase">Branding & Visual Identity</h4>
					<p class="market__description sr-only regular-14 leading-120">
						Build memorable identities to ensure every unified touchpoint radiates power.
					</p>
				</div>
			</div>
		</li>
		<li class="col-6 col-md-4 col-lg-3">
			<div class="card--market market__item">
				<div class="market__image">
					<picture>
						<img src="/images/service/ui-ux-design.png" alt="UI / UX Design  Example" />
					</picture>
					<Tag class="market__tag" size="small" color="dark-grey">Design</Tag>
				</div>
				<div class="market__content">
					<h4 class="market__title font-mono regular-20 uppercase">UI/UX Design</h4>
					<p class="market__description sr-only regular-14 leading-120">
						UX drives results. We design intuitive interfaces optimized for conversion.
					</p>
				</div>
			</div>
		</li>
		<li class="col-6 col-md-4 col-lg-3">
			<div class="card--market market__item">
				<div class="market__image">
					<picture>
						<img
							src="/images/service/digital-print-media.png"
							alt="Digital and Print Media Design Example"
						/>
					</picture>
					<Tag class="market__tag" size="small" color="dark-grey">Design</Tag>
				</div>
				<div class="market__content">
					<h4 class="market__title font-mono regular-20 uppercase">Digital & Print Media</h4>
					<p class="market__description sr-only regular-14 leading-120">
						Omnichannel brand voice. We adapt visuals across all media to maximize recall.
					</p>
				</div>
			</div>
		</li>
		<li class="col-6 col-md-4 col-lg-3">
			<div class="card--market market__item">
				<div class="market__image">
					<picture>
						<img src="/images/service/web-development.png" alt="Web Page Example" />
					</picture>
					<Tag class="market__tag" size="small" color="dark-grey">development</Tag>
				</div>
				<div class="market__content">
					<h4 class="market__title font-mono regular-20 uppercase">Web Development</h4>
					<p class="market__description sr-only regular-14 leading-120">
						Web tech scales. We build high-performance, secure sites tailored to your goals.
					</p>
				</div>
			</div>
		</li>
		<li class="col-6 col-md-4 col-lg-3">
			<div class="card--market market__item">
				<div class="market__image">
					<picture>
						<img src="/images/service/mobile-development.png" alt="Mobile Apps Design Example" />
					</picture>
					<Tag class="market__tag" size="small" color="dark-grey">development</Tag>
				</div>
				<div class="market__content">
					<h4 class="market__title font-mono regular-20 uppercase">Mobile Development</h4>
					<p class="market__description sr-only regular-14 leading-120">
						We build fast, intuitive apps that foster loyalty and daily usage.
					</p>
				</div>
			</div>
		</li>
		<li class="col-6 col-md-4 col-lg-3">
			<div class="card--market market__item">
				<div class="market__image">
					<picture>
						<img
							src="/images/service/software-development.png"
							alt="Software Development Example"
						/>
					</picture>
					<Tag class="market__tag" size="small" color="dark-grey">development</Tag>
				</div>
				<div class="market__content">
					<h4 class="market__title font-mono regular-20 uppercase">Software Development</h4>
					<p class="market__description sr-only regular-14 leading-120">
						Build bespoke systems to automate processes and gain a competitive edge.
					</p>
				</div>
			</div>
		</li>
		<li class="col-6 col-md-4 col-lg-3">
			<div class="card--market market__item">
				<div class="market__image">
					<picture>
						<img
							src="/images/service/tech-stack-expertise.png"
							alt="Tech Stacks we help you with"
						/>
					</picture>
					<Tag class="market__tag" size="small" color="dark-grey">development</Tag>
				</div>
				<div class="market__content">
					<h4 class="market__title font-mono regular-20 uppercase">Tech Stack Expertise</h4>
					<p class="market__description sr-only regular-14 leading-120">
						Modern tech expertise. We deploy the optimal stack to ensure long-term scalability.
					</p>
				</div>
			</div>
		</li>
		<li class="col-6 col-md-4 col-lg-3">
			<div class="card--market market__item">
				<div class="market__image">
					<picture>
						<img src="/images/service/cloud.png" alt="Tech Stacks we help you with" />
					</picture>
					<Tag class="market__tag" size="small" color="dark-grey">Cloud Services</Tag>
				</div>
				<div class="market__content">
					<h4 class="market__title font-mono regular-20 uppercase">Cloud & AWS Services</h4>
					<p class="market__description sr-only regular-14 leading-120">
						Optimize your infrastructure for peak security and performance.
					</p>
				</div>
			</div>
		</li>
		<li class="col-6 col-md-4 col-lg-3">
			<div class="card--market market__item">
				<div class="market__image">
					<picture>
						<img src="/images/service/dev-ops.png" alt="Tech Stacks we help you with" />
					</picture>
					<Tag class="market__tag" size="small" color="dark-grey">Cloud Services</Tag>
				</div>
				<div class="market__content">
					<h4 class="market__title font-mono regular-20 uppercase">DevOps & Infrastructre</h4>
					<p class="market__description sr-only regular-14 leading-120">
						Shorten deployment cycles and ensure reliable, continuous delivery.
					</p>
				</div>
			</div>
		</li>
		<li class="col-6 col-md-4 col-lg-3">
			<div class="card--market market__item">
				<div class="market__image">
					<picture>
						<img src="/images/service/analytics.png" alt="Data Analytics Illustration" />
					</picture>
					<Tag class="market__tag" size="small" color="dark-grey">Cloud Services</Tag>
				</div>
				<div class="market__content">
					<h4 class="market__title font-mono regular-20 uppercase">Data & Analytics</h4>
					<p class="market__description sr-only regular-14 leading-120">
						Meaningful data analysis to fuel growth and improve operational efficiency.
					</p>
				</div>
			</div>
		</li>
		<li class="col-6 col-md-4 col-lg-3">
			<div class="card--market market__item">
				<div class="market__image">
					<picture>
						<img src="/images/service/growth-hacking.png" alt="Growth Hacking" />
					</picture>
					<Tag class="market__tag" size="small" color="dark-grey">Marketing</Tag>
				</div>
				<div class="market__content">
					<h4 class="market__title font-mono regular-20 uppercase">Growth Hacking</h4>
					<p class="market__description sr-only regular-14 leading-120">
						Rapid, data-driven experimentation to find efficient acquisition and retention paths.
					</p>
				</div>
			</div>
		</li>
		<li class="col-6 col-md-4 col-lg-3">
			<div class="card--market market__item">
				<div class="market__image">
					<picture>
						<img src="/images/service/seo.png" alt="SEO Illustration" />
					</picture>
					<Tag class="market__tag" size="small" color="dark-grey">Marketing</Tag>
				</div>
				<div class="market__content">
					<h4 class="market__title font-mono regular-20 uppercase">
						Search & Performance Marketing
					</h4>
					<p class="market__description sr-only regular-14 leading-120">
						High search rankings and optimized campaigns for clear return on ad spend.
					</p>
				</div>
			</div>
		</li>
		<li class="col-6 col-md-4 col-lg-3">
			<div class="card--market market__item">
				<div class="market__image">
					<picture>
						<img src="/images/service/social-media.png" alt="Social Media Marketing Illustration" />
					</picture>
					<Tag class="market__tag" size="small" color="dark-grey">Marketing</Tag>
				</div>
				<div class="market__content">
					<h4 class="market__title font-mono regular-20 uppercase">Social Media Marketing</h4>
					<p class="market__description sr-only regular-14 leading-120">
						Engaging content and targeted ads to build community and drive conversions.
					</p>
				</div>
			</div>
		</li>
		<li class="col-6 col-md-4 col-lg-3">
			<div class="card--market market__item">
				<div class="market__image">
					<picture>
						<img src="/images/service/content-marketing.png" alt="Content Marketing Illustration" />
					</picture>
					<Tag class="market__tag" size="small" color="dark-grey">Marketing</Tag>
				</div>
				<div class="market__content">
					<h4 class="market__title font-mono regular-20 uppercase">Content & Brand Marketing</h4>
					<p class="market__description sr-only regular-14 leading-120">
						Valuable content to attract customers and position your brand as a leader.
					</p>
				</div>
			</div>
		</li>
		<li class="col-6 col-md-4 col-lg-3">
			<div class="card--market market__item">
				<div class="market__image">
					<picture>
						<img
							src="/images/service/data-reporting.png"
							alt="Analytics and Reporting Illustration"
						/>
					</picture>
					<Tag class="market__tag" size="small" color="dark-grey">Marketing</Tag>
				</div>
				<div class="market__content">
					<h4 class="market__title font-mono regular-20 uppercase">Analytics & Reporting</h4>
					<p class="market__description sr-only regular-14 leading-120">
						Optimize your infrastructure for peak security and performance.
					</p>
				</div>
			</div>
		</li>
		<li class="col-6 col-md-4 col-lg-3">
			<div class="card--market market__item">
				<div class="market__image">
					<picture>
						<img src="/images/service/support.png" alt="Analytics and Reporting Illustration" />
					</picture>
					<Tag class="market__tag" size="small" color="dark-grey">Expert Services</Tag>
				</div>
				<div class="market__content">
					<h4 class="market__title font-mono regular-20 uppercase">Consulting & Support</h4>
					<p class="market__description sr-only regular-14 leading-120">
						Optimize your infrastructure for peak security and performance.
					</p>
				</div>
			</div>
		</li>
	</ul>
</section>

<section class="stats__section py-4 py-md-6 pb-lg-9" id="stats" data-section="dark">
	<div class="grid-row row-gap-6 gap-md-3 gap-lg-6 w-100">
		<div class="col-12 col-md-4">
			<p class="heading-1 mb-1">70%</p>
			<p class="accent-300 font-mono uppercase font-24">avg. cost saved vs US/UK hiring</p>
		</div>
		<div class="col-12 col-md-4">
			<p class="heading-1 mb-1">2 wks</p>
			<p class="accent-300 font-mono uppercase font-24">avg. team setup time</p>
		</div>
		<div class="col-12 col-md-4">
			<p class="heading-1 mb-1">50+</p>
			<p class="accent-300 font-mono uppercase font-24">startups already running with us</p>
		</div>
	</div>
</section>
<section
	class="py-4 py-md-5 relative"
	id="contact"
	aria-labelledby="#contact-title"
	data-section="dark"
>
	<div class="content__wrapper relative z-1">
		<h2 class="heading-3 uppercase mb-4 contact__title text-center" id="contact-title">
			Get Free Consultation Today
		</h2>
		<form id="contactForm" class="contact__form mb-lg-8" onsubmit={submitForm}>
			<div class="fl-col grid-lg-row gap-1">
				<label for="fullName" class="form__group" class:error={fullName.error}>
					<span class="sr-only">Full Name</span>
					<div class="form__input form--required">
						<input
							type="text"
							class="form__control"
							name="fullName"
							oninput={() => {
								fullName.validate();
							}}
							bind:value={fullName.value}
							id="fullName"
							placeholder="Full Name"
							aria-required="true"
						/>
						<span class="error-message">
							{#if fullName.changed && fullName.error}
								{fullName.errorMessage}
							{/if}
						</span>
					</div>
				</label>
				<label for="companyName" class="form__group" class:error={companyName.error}>
					<span class="sr-only">Company Name</span>
					<div class="form__input">
						<input
							type="text"
							class="form__control"
							name="companyName"
							bind:value={companyName.value}
							oninput={() => {
								companyName.validate();
							}}
							id="companyName"
							placeholder="Company Name"
						/>
						<span class="error-message">
							{#if companyName.changed && companyName.error}
								{companyName.errorMessage}
							{/if}
						</span>
					</div>
				</label>
				<label for="email" class="form__group" class:error={email.error}>
					<span class="sr-only">Email Address</span>
					<div class="form__input form--required">
						<input
							type="email"
							class="form__control"
							bind:value={email.value}
							oninput={() => {
								email.validate();
							}}
							name="email"
							id="email"
							placeholder="Email Address"
							aria-required="true"
						/>
						<span class="error-message">
							{#if email.changed && email.error}
								{email.errorMessage}
							{/if}
						</span>
					</div>
				</label>
				<label for="phoneNumber" class="form__group" class:error={phoneNumber.error}>
					<span class="sr-only">Your Phone Number</span>
					<div class="form__input">
						<input
							type="tel"
							class="form__control"
							name="phoneNumber"
							id="phoneNumber"
							bind:value={phoneNumber.value}
							oninput={() => {
								phoneNumber.validate();
							}}
							placeholder="Phone Number"
						/>
						<span class="error-message">
							{#if phoneNumber.changed && phoneNumber.error}
								{phoneNumber.errorMessage}
							{/if}
						</span>
					</div>
				</label>
				<label for="message" class="form__group" class:error={message.error}>
					<span class="sr-only">Message</span>
					<div class="form__input">
						<textarea
							name="message"
							id="message"
							bind:value={message.value}
							class="form__control"
							oninput={() => {
								message.validate();
							}}
							placeholder="Tell us about your project"
							rows="4"
						></textarea>
						<span class="error-message">
							{#if message.changed && message.error}
								{message.errorMessage}
							{/if}
						</span>
					</div>
				</label>
				<div class="col-start-lg-4 col-end-lg-10">
					<button class="btn--primary w-full" type="submit" class:disabled={!validity}>
						<span class="btn__wrapper"><span class="btn__text">Send Message</span></span>
					</button>
				</div>
			</div>
			<div
				class="regular-12 font-mono uppercase tracking-wide text-center neutral-400 py-3 py-lg-4"
			>
				OR
			</div>
			<div class="social__link-wrapper fl-row gap-2 gap-lg-4 mb-4 jc-center">
				{#if socials?.facebook}
					<a
						href={socials.facebook}
						class="social--light social--facebook"
						target="_blank"
						title={`${siteInfo.name} facebook Profile`}
					>
						<div class="sr-only">{siteInfo.name} facebook Profile</div>
					</a>
				{/if}
				{#if socials?.instagram}
					<a
						href={socials.instagram}
						class="social--light social--instagram"
						target="_blank"
						title={`${siteInfo.name} instagram profile`}
					>
						<div class="sr-only">{siteInfo.name} instagram profile</div>
					</a>
				{/if}
				{#if socials?.linkedin}
					<a
						href={socials.linkedin}
						class="social--light social--linkedin"
						target="_blank"
						title={`${siteInfo.name} linkedin Profile`}
					>
						<div class="sr-only">{siteInfo.name} linkedin Profile</div>
					</a>
				{/if}
				{#if socials?.pinterest}
					<a
						href={socials.pinterest}
						class="social--light social--pinterest"
						target="_blank"
						title={`${siteInfo.name} pinterest profile`}
					>
						<div class="sr-only">{siteInfo.name} pinterest profile</div>
					</a>
				{/if}
				{#if socials?.threads}
					<a
						href={socials.threads}
						class="social--light social--threads"
						target="_blank"
						title={`${siteInfo.name} threads profile`}
					>
						<div class="sr-only">{siteInfo.name} threads profile</div>
					</a>
				{/if}
				{#if socials?.tiktok}
					<a
						href={socials.tiktok}
						class="social--light social--tiktok"
						target="_blank"
						title={`${siteInfo.name} tiktok profile`}
					>
						<div class="sr-only">{siteInfo.name} tiktok profile</div>
					</a>
				{/if}
				{#if socials?.whatsapp}
					<a
						href={socials.whatsapp}
						class="social--light social--whatsapp"
						target="_blank"
						title={`${siteInfo.name} whatsapp Profile`}
					>
						<div class="sr-only">{siteInfo.name} whatsapp Profile</div>
					</a>
				{/if}

				{#if socials?.x}
					<a
						href={socials.x}
						class="social--light social--x"
						target="_blank"
						title={`${siteInfo.name} X Profile`}
					>
						<div class="sr-only">{siteInfo.name} X Profile</div>
					</a>
				{/if}

				{#if socials?.youtube}
					<a
						href={socials.youtube}
						class="social--light social--youtube"
						target="_blank"
						title={`${siteInfo.name} youtube profile`}
					>
						<div class="sr-only">{siteInfo.name} youtube profile</div>
					</a>
				{/if}

				<!-- <a href="#" class="social--light social--youtube" target="_blank">
									<div class="sr-only">Youtube</div>
								</a> -->
			</div>
		</form>
	</div>
</section>

{#snippet whatsappButton()}
	<a
		href="https://wa.me/971561448979"
		class="floating--button social--whatsapp"
		target="_blank"
		id="whatsappCall"
	>
		<span class="sr-only">Reach out to us on whatsapp</span>
	</a>
{/snippet}
{#if showModal}
	<Modal bind:showModal>
		{#snippet header()}
			{modal.headerText}
		{/snippet}
		{#snippet content()}
			{modal.contentText}
			{#if showErrorInModal}
				<div>
					If it persists after some time, please email us at: <a
						class="link"
						href="mailto:support@nepaxis.com">support@nepaxis.com</a
					>
				</div>
			{/if}
		{/snippet}
	</Modal>
{/if}

<style lang="scss">
	.floating--button {
		background-color: var(--clr-accent-300);
		background-size: 2rem;
		border: 1px solid hsl(from var(--clr-accent-400) h s l / 20%);
		--icon-width: 5rem;
		border-radius: 100%;
		position: fixed;
		inset-block-end: 3rem;
		inset-inline-end: 2rem;
	}
	.card--market {
		--title-color: var(--clr-neutral-700);
		--description-color: var(--clr-neutral-500);
		--border-radius: 0.5rem;
		--background-color: var(--clr-neutral-100);
		--padding: 0.25rem;
	}
	.market {
		&__item {
			background-color: var(--background-color);
			padding: var(--padding);
			border-radius: var(--border-radius);
			/* display: grid; */
			block-size: 100%;
		}
		&__content {
			padding: 0.5rem 0.35rem;

			@media screen and (width >= 992px) {
				padding: 1rem;
			}
		}
		&__title {
			color: var(--title-color);
			margin-block: 0.5rem 0.25em;
			text-wrap: pretty;
		}
		&__description {
			color: var(--description-color);
			text-wrap: balance;
			font-size: small;

			@media screen and (min-width: 992px) {
				margin-inline-end: 1rem;
			}
		}
		&__image {
			position: relative;
			border-radius: var(--border-radius);

			img {
				border-radius: var(--border-radius);
				background-color: var(--clr-dark-1000);
				object-fit: contain;
				border: 1px solid var(--clr-neutral-200);

				@media screen and (width >= 992px) {
					aspect-ratio: 16 / 9;
				}
			}
		}
	}
	:global(.market__tag) {
		position: absolute;
		inset-inline-start: calc(var(--padding) * 2);
		inset-block-start: calc(var(--padding) * 2);
	}
	.banner__img {
		:global(img) {
			border-radius: 1.25rem;
		}
	}
	.card--why {
		border-radius: 0.875rem;
		padding: 1.25em;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border: 1px solid hsl(from var(--clr-dark-1000) h s l / 15%);
		background: var(--clr-neutral-100);
		hyphens: auto;
		block-size: 100%;

		@media screen and (width> 575px) {
			justify-content: space-between;
			/* aspect-ratio: 2 / 1; */
			gap: 1rem;
			block-size: 100%;
		}
		@media screen and (width> 992px) {
			/* aspect-ratio: 3 / 2; */
			gap: 0;
			inline-size: 100%;
			block-size: 100%;
		}
		@media screen and (width> 1440px) {
			aspect-ratio: 3 / 2;
			gap: 0;
		}
	}

	.form__group {
		grid-column: 1 /12;
		@media screen and (min-width: 768px) {
			grid-column: 2 / 10;
		}
		@media screen and (min-width: 992px) {
			grid-column: 4 / 10;
		}

		&.error {
			padding-block-end: 2rem;
		}
	}
	.form__input {
		inline-size: 100%;
		--_pad_y: 1rem;
	}
	.form__input:has(.form__control[type='email']) {
		inline-size: 100%;
	}
	textarea.form__control {
		border-radius: 1rem;
		text-transform: unset;
	}
</style>
