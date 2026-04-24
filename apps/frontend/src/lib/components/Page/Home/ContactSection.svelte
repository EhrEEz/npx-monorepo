<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Modal from '$lib/components/Modal/Modal.svelte';

	import {
		FormControl,
		validateFullName,
		validateCompanyName,
		validateEmail,
		validatePhoneNumber,
		validateMessage
	} from './contact.svelte';
	import {
		initScrambleTitle,
		initFormGroupAnimations,
		initContactPinAnimation
	} from './contact.animations';

	const ACCESS_KEY = `5e3a9806-0470-49b0-ab74-d7109400cdc6`;

	// ── Form state ────────────────────────────────────────────
	let fullName = new FormControl({ validate: validateFullName });
	let companyName = new FormControl({ validate: validateCompanyName });
	let email = new FormControl({ validate: validateEmail });
	let phoneNumber = new FormControl({ validate: validatePhoneNumber });
	let message = new FormControl({ validate: validateMessage });

	// Button is disabled until required fields are touched AND error-free
	let validity = $derived(
		fullName.changed &&
			!fullName.error &&
			email.changed &&
			!email.error &&
			!companyName.error &&
			!phoneNumber.error &&
			!message.error
	);

	const formData = $derived({
		fullName: fullName.value,
		companyName: companyName.value,
		email: email.value,
		phoneNumber: phoneNumber.value,
		message: message.value,
		access_key: ACCESS_KEY
	});

	// ── Modal state ───────────────────────────────────────────
	let showModal = $state(false);
	let showErrorInModal = $state(false);
	const modal = { headerText: '', contentText: '' };

	async function submitForm(event: SubmitEvent) {
		event.preventDefault();
		if (!validity) return;

		try {
			const res = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				body: JSON.stringify(formData),
				headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
			});
			const json = await res.json();

			if (json.success) {
				modal.headerText = 'Your message has been submitted.';
				modal.contentText = "We've received your message and will get back to you very soon.";
				[fullName, companyName, email, phoneNumber, message].forEach((f) => f.reset());
			} else {
				modal.headerText = `Error ${json.status}: ${json.message}`;
				modal.contentText = json.detail;
				showErrorInModal = true;
			}
		} catch {
			modal.headerText = 'Network Error';
			modal.contentText = 'Unable to submit form. Please try again.';
		}

		showModal = true;
	}

	// ── Animation state ───────────────────────────────────────
	let contact_section = $state<HTMLElement | null>(null);
	let contactPinTrigger: ScrollTrigger | null = null;
	let triggersBefore: ScrollTrigger[] = [];

	function setupPinAnimation() {
		contactPinTrigger?.kill();
		contactPinTrigger = null;
		if (contact_section) {
			contactPinTrigger = initContactPinAnimation(contact_section);
		}
	}

	onMount(() => {
		triggersBefore = ScrollTrigger.getAll();
		initScrambleTitle();
		initFormGroupAnimations();

		const t = setTimeout(setupPinAnimation, 200);

		return () => {
			clearTimeout(t);
			ScrollTrigger.getAll()
				.filter((st) => !triggersBefore.includes(st))
				.forEach((st) => st.kill());
			triggersBefore = [];
		};
	});

	afterNavigate(() => {
		if (browser) requestAnimationFrame(() => setTimeout(setupPinAnimation, 200));
	});

	onDestroy(() => {
		contactPinTrigger?.kill();
		contactPinTrigger = null;
	});
</script>

<div>
	<section
		class="contact__section pt-8 pt-md-9 pt-xl-10 pb-4 pb-md-8 py-2xl-10 relative"
		id="contact-section"
		data-section="dark"
		aria-labelledby="#contact-title"
		bind:this={contact_section}
	>
		<div class="content__wrapper relative z-1">
			<h1 class="heading-2 uppercase mb-4 contact__title" id="contact-title">Let's Talk</h1>
			<form id="contactForm" class="contact__form mb-lg-9 mb-6 mb-lg-8" onsubmit={submitForm}>
				<div class="grid-lg-row gap-lg-3 gap-xl-0">
					<div class="fl-col row-gap-3 col-gap-2 col-lg-10 col-xl-8 col-2xl-6 mb-3 mb-lg-0">
						<label for="fullName" class="form__group" class:error={fullName.error}>
							<div class="form__line">
								<div class="form__description regular-25 tracking-4tight neutral-300">
									My Name is &nbsp;
								</div>
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
							</div>
						</label>
						<label for="companyName" class="form__group" class:error={companyName.error}>
							<div class="form__line">
								<div class="form__description regular-25 tracking-4tight neutral-300">
									representing &nbsp;
								</div>
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
							</div>
						</label>
						<label for="email" class="form__group" class:error={email.error}>
							<div class="form__line">
								<div class="form__description regular-25 tracking-4tight neutral-300">
									You can contact me at &nbsp;
								</div>
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
							</div>
						</label>
						<label for="phoneNumber" class="form__group" class:error={phoneNumber.error}>
							<div class="form__line">
								<div class="form__description regular-25 tracking-4tight neutral-300">
									or call us on &nbsp;&nbsp;
								</div>
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
							</div>
						</label>
						<label for="message" class="form__group" class:error={message.error}>
							<div class="form__line">
								<div class="form__description regular-25 tracking-4tight neutral-300">
									And I want to say:&nbsp;&nbsp;
								</div>
								<div class="form__input">
									<textarea
										name="message"
										id="message"
										bind:value={message.value}
										class="form__control"
										oninput={() => {
											message.validate();
										}}
										placeholder="Message"
										rows="4"
									></textarea>
									<span class="error-message">
										{#if message.changed && message.error}
											{message.errorMessage}
										{/if}
									</span>
								</div>
							</div>
						</label>
					</div>
					<div
						class="big__button-wrapper fl-col jc-end w-100 col-lg-4 col-start-xl-9 col-start-2xl-8 col-end-xl-13"
					>
						<button class="btn--primary w-100 btn--full" type="submit" class:disabled={!validity}>
							<span class="btn__wrapper"><span class="btn__text">Send Message</span></span>
						</button>
					</div>
				</div>
			</form>
		</div>
	</section>
</div>
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
