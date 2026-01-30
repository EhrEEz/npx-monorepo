<script lang="ts">
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { SplitText } from 'gsap/SplitText';
	import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
	import Link from '$lib/components/Link/Link.svelte';
	import Newsletter from '$lib/components/Newsletter/Newsletter.svelte';
	import { page } from '$app/state';

	const CURRENT_YEAR = new Date().getFullYear();
	let footer = $state<HTMLElement>();

	const currentPage = $derived(page.route.id);

	$effect(() => {
		gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger, SplitText);
		let contactSection: HTMLElement | null;
		if (currentPage === '/') {
			if (!footer) {
				return;
			}
			contactSection = document.querySelector('.contact__section');

			if (contactSection) {
				const footerHeight = footer.offsetHeight;
				const slideOutDuration = contactSection.offsetHeight * 1.25;
				const totalDuration = footerHeight + slideOutDuration;
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: contactSection,
						start: 'bottom bottom',
						end: `+=${totalDuration}`,
						scrub: true,
						pin: contactSection,
						pinSpacing: false,
						id: 'contact-pin-slide'
					}
				});

				tl.to(
					contactSection,
					{
						duration: footerHeight,
						y: 0,
						ease: 'none'
					},
					0
				);

				tl.to(
					contactSection,
					{
						duration: slideOutDuration,
						y: -contactSection.offsetHeight,
						ease: 'none'
					},
					footerHeight
				);
			}
		}
		// return () => {
		// 	ScrollTrigger.getById('contact-pin-slide')?.kill();
		// };
	});
</script>

<footer
	bind:this={footer}
	class="bg-neutral-100 neutral-700 content-grid full-width py-2 pt-md-2 pt-lg-0 footer__section"
	data-section="light"
>
	<div class="grid-md-row pt-4 pb-2 py-md-5 py-lg-7 ai-center">
		<div class="col-md-5 col-lg-4">
			<div class="footer__logo-wrapper mb-4 mb-lg-5">
				<img src="/logo-dark.svg" alt="Nepaxis Icon" />
			</div>
			<h5 class="footer__tagline regular-36 uppercase mb-4 mb-lg-5 me-xl-7">
				Start your digital transformation with us!
			</h5>
			<div class="social__link-wrapper fl-row gap-2 gap-lg-4 mb-4">
				<a
					href="https://www.linkedin.com/company/nepaxis/"
					class="social--linkedin"
					target="_blank"
				>
					<div class="sr-only">Linked In</div>
				</a>
				<a href="https://x.com/nepaxis" class="social--x" target="_blank">
					<div class="sr-only">X</div>
				</a>
				<a
					href="https://www.facebook.com/profile.php?id=61583287982556"
					class="social--facebook"
					target="_blank"
				>
					<div class="sr-only">Facebook</div>
				</a>
				<a href="https://wa.me/971561448979" class="social--whatsapp" target="_blank">
					<div class="sr-only">Whatsapp</div>
				</a>
				<a href="https://www.instagram.com/nepaxis" class="social--instagram" target="_blank">
					<div class="sr-only">Instagram</div>
				</a>
				<!-- <a href="#" class="social--youtube" target="_blank">
									<div class="sr-only">Youtube</div>
								</a> -->
			</div>
		</div>
		<div class="col-start-md-7 col-start-lg-7 col-start-2xl-9 col-end-md-13">
			<div class="fl-md-row jc-md-between gap-4 w-100 mb-5">
				<h6 class="uppercase leading-120 medium-15 shrink-0 w-md-30 mb-3 mb-md-0">Quick Links</h6>
				<div class="w-100 grid grid-template-col-2 gap-1 w-lg-70">
					<Link href="#about-section" scrollTo="#about-section" class="regular-13 footer__link"
						>About us</Link
					>

					<Link
						href="#services-section"
						class="regular-13 footer__link"
						scrollTo="#services-section">Our Services</Link
					>
					<Link
						href="#approach-section"
						class="regular-13 footer__link"
						scrollTo="#approach-section">Our Approach</Link
					>
					<Link href="#contact-section" class="regular-13 footer__link" scrollTo="#contact-section"
						>Contact Form</Link
					>
				</div>
			</div>
			<Newsletter />
		</div>
	</div>
	<div class="legal regular-12 font-mono uppercase tracking-wide text-center neutral-400 py-lg-2">
		Nepaxis Technologies, LLC © <span id="currentYear">{CURRENT_YEAR}</span>
	</div>
</footer>
