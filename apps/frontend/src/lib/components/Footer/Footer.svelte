<script lang="ts">
	import { getContext } from 'svelte';
	import Link from '$lib/components/Link/Link.svelte';
	import Newsletter from '$lib/components/Newsletter/Newsletter.svelte';
	import { page } from '$app/state';
	import type { SiteSetting } from '$backend/src/payload-types';
	import { resolve } from '$app/paths';

	const siteSettings = getContext<{ settings: SiteSetting }>('site-settings')
		.settings as SiteSetting;
	const siteInfo = $derived(siteSettings.basic_settings);
	const contacts = $derived(siteInfo.contact);
	const socials = $derived(siteSettings.social_media);

	const currentPage = $derived<string | null>(page.url.pathname);
	const CURRENT_YEAR = new Date().getFullYear();
</script>

<footer
	class="bg-neutral-100 neutral-700 content-grid full-width py-2 pt-md-2 pt-lg-0 footer__section"
	data-section="light"
>
	<div class="content__wrapper relative z-1 footer__separator py-4 py-md-5 py-lg-7 py-xl-8">
		{#if currentPage !== '/contact'}
			<div class="fl-md-row mb-4 mb-lg-6 mb-xl-7 al-center">
				<h2 class="contact__title heading-2 uppercase mb-3 mb-md-0 w-full" id="contact-title">
					Let's Talk
				</h2>
				<div
					class="big__button-wrapper fl-col jc-end w-100 w-lg-50 col-lg-4 col-start-xl-9 col-start-2xl-8 col-end-xl-13"
				>
					<a href={resolve('/contact')} class="btn--outline btn--black btn--full">
						<span class="btn__wrapper"><span class="btn__text">Contact</span></span>
					</a>
				</div>
			</div>
		{/if}
		<div class="grid-md-row contact__info">
			<div class="info-wrapper--left col-md-6 col-lg-7 mb-4 mb-lg-0">
				<h4 class="medium-15 neutral-700 mb-2 mb-lg-3 uppercase info__title">Business</h4>
				{#if contacts}
					<div class="info__body">
						<div class="mb-2">
							<a class="link light" href="mailto:{contacts.contact_email}"
								>{contacts.contact_email}</a
							>
						</div>
						<div class="mb-2">
							<a
								class="link light"
								rel="external"
								target="_blank"
								href="tel:{contacts.phone_number_1}">{contacts.phone_number_1}</a
							>{#if contacts?.phone_number_2},
								<a
									class="link light"
									rel="external"
									target="_blank"
									href="tel:{contacts?.phone_number_2}">{contacts?.phone_number_2}</a
								>{/if}
						</div>
						{#if contacts?.address?.address_line_1}
							<address class="uppercase no-italics regular-13 neutral-600">
								{contacts?.address?.address_line_1}
								{#if contacts?.address?.address_line_2}<br />
									{contacts.address.address_line_2}{/if}
								{#if contacts?.address?.address_line_3}<br />
									{contacts.address.address_line_3}{/if}
							</address>
						{/if}
					</div>
				{/if}
			</div>
			<div class="info-wrapper--right col-md-5 ps-md-4 ps-lg-5">
				{#if contacts}
					{#if contacts?.career_email}
						<div class="info--careers mb-4 mb-lg-4">
							<h4 class="medium-15 neutral-700 mb-2 mb-lg-3 uppercase info__title">Careers</h4>
							<div class="info__body">
								<p class="uppercase no-italics regular-13 neutral-600 mb-1">Join us</p>
								<div>
									<a class="link light" href="mailto:{contacts.career_email}"
										>{contacts.career_email}</a
									>
								</div>
							</div>
						</div>
					{/if}
					{#if contacts?.support_email}
						<div class="info--help">
							<h4 class="medium-15 neutral-700 mb-2 mb-lg-3 uppercase info__title">
								Help & Support
							</h4>
							<div class="info__body">
								<p class="uppercase no-italics regular-13 neutral-600 mb-1">
									Do you have a request / Query?
								</p>
								<div>
									<a class="link light" href="mailto:{contacts.support_email}"
										>{contacts.support_email}</a
									>
								</div>
							</div>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
	<div class="grid-md-row pt-4 pb-2 py-md-5 py-lg-7 ai-center">
		<div class="col-md-5 col-lg-4">
			<div class="footer__logo-wrapper mb-4 mb-lg-5">
				<img src="/logo-dark.svg" alt="Nepaxis Icon" />
			</div>
			<h5 class="footer__tagline regular-36 uppercase mb-4 mb-lg-5 me-xl-7">
				{siteInfo?.cta_tagline
					? siteInfo?.cta_tagline
					: `Start your digital transformation with us!`}
			</h5>
			<div class="social__link-wrapper fl-row gap-2 gap-lg-4 mb-4">
				{#if socials?.facebook}
					<a
						href={socials.facebook}
						class="social--facebook"
						target="_blank"
						title={`${siteInfo.name} facebook Profile`}
					>
						<div class="sr-only">{siteInfo.name} facebook Profile</div>
					</a>
				{/if}
				{#if socials?.instagram}
					<a
						href={socials.instagram}
						class="social--instagram"
						target="_blank"
						title={`${siteInfo.name} instagram profile`}
					>
						<div class="sr-only">{siteInfo.name} instagram profile</div>
					</a>
				{/if}
				{#if socials?.linkedin}
					<a
						href={socials.linkedin}
						class="social--linkedin"
						target="_blank"
						title={`${siteInfo.name} linkedin Profile`}
					>
						<div class="sr-only">{siteInfo.name} linkedin Profile</div>
					</a>
				{/if}
				{#if socials?.pinterest}
					<a
						href={socials.pinterest}
						class="social--pinterest"
						target="_blank"
						title={`${siteInfo.name} pinterest profile`}
					>
						<div class="sr-only">{siteInfo.name} pinterest profile</div>
					</a>
				{/if}
				{#if socials?.threads}
					<a
						href={socials.threads}
						class="social--threads"
						target="_blank"
						title={`${siteInfo.name} threads profile`}
					>
						<div class="sr-only">{siteInfo.name} threads profile</div>
					</a>
				{/if}
				{#if socials?.tiktok}
					<a
						href={socials.tiktok}
						class="social--tiktok"
						target="_blank"
						title={`${siteInfo.name} tiktok profile`}
					>
						<div class="sr-only">{siteInfo.name} tiktok profile</div>
					</a>
				{/if}
				{#if socials?.whatsapp}
					<a
						href={socials.whatsapp}
						class="social--whatsapp"
						target="_blank"
						title={`${siteInfo.name} whatsapp Profile`}
					>
						<div class="sr-only">{siteInfo.name} whatsapp Profile</div>
					</a>
				{/if}

				{#if socials?.x}
					<a
						href={socials.x}
						class="social--x"
						target="_blank"
						title={`${siteInfo.name} X Profile`}
					>
						<div class="sr-only">{siteInfo.name} X Profile</div>
					</a>
				{/if}

				{#if socials?.youtube}
					<a
						href={socials.youtube}
						class="social--youtube"
						target="_blank"
						title={`${siteInfo.name} youtube profile`}
					>
						<div class="sr-only">{siteInfo.name} youtube profile</div>
					</a>
				{/if}

				<!-- <a href="#" class="social--youtube" target="_blank">
									<div class="sr-only">Youtube</div>
								</a> -->
			</div>
		</div>
		<div class="col-start-md-7 col-start-lg-7 col-start-2xl-9 col-end-md-13">
			<div class="fl-md-row jc-md-between gap-4 w-100 mb-5">
				<h6 class="uppercase leading-120 medium-15 shrink-0 w-md-30 mb-3 mb-md-0">Quick Links</h6>
				<div class="w-100 grid grid-template-col-2 gap-1 w-lg-70">
					<Link href="/#home-section" scrollTo="/#home-section" class="regular-13 footer__link"
						>Home</Link
					>
					<a href={resolve('/about')} class="regular-13 footer__link">About us</a>

					<Link
						href="/#services-section"
						class="regular-13 footer__link"
						scrollTo="#services-section">Our Services</Link
					>
					<Link
						href="/#approach-section"
						class="regular-13 footer__link"
						scrollTo="/#approach-section">Our Approach</Link
					>
					<Link
						href={resolve('/contact')}
						class="regular-13 footer__link"
						scrollTo="#contact-section">Contact</Link
					>
					<Link href="/blog" class="regular-13 footer__link">Blog</Link>
				</div>
			</div>
			<Newsletter />
		</div>
	</div>
	<div class="legal regular-12 font-mono uppercase tracking-wide text-center neutral-400 py-lg-2">
		{siteInfo.name} © <span id="currentYear">{CURRENT_YEAR}</span> |
		<a class="link light" href={resolve('/privacy-policy')}>Privacy Policy</a>
		& <a class="link light" href={resolve('/terms-of-service')}>Terms of Service</a>
	</div>
</footer>

<style>
	.footer__separator {
		border-block-end: 1px solid var(--clr-neutral-700);
	}
</style>
