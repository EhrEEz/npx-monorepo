// contact.animations.ts
import { browser } from '$app/environment';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger, SplitText);

export function initScrambleTitle() {
	if (!browser) return;

	document.fonts.ready.then(() => {
		const contact_title = document.querySelector('.contact__title');
		if (!contact_title) return;

		SplitText.create('.contact__title', {
			type: 'words,lines',
			autoSplit: true,
			onSplit(self) {
				gsap.set(self.words, { opacity: 0 });
				gsap.to(self.words, {
					duration: 1,
					opacity: 1,
					ease: 'none',
					scrambleText: {
						speed: 0.7,
						revealDelay: 0.35,
						text: '{original}',
						chars: 'upperCase'
					},
					scrollTrigger: {
						trigger: '.contact__title',
						start: 'top 70%',
						end: 'bottom 0%',
						toggleActions: 'play none none none'
					}
				});
			}
		});
	});
}

export function initFormGroupAnimations() {
	if (!browser) return;

	document.fonts.ready.then(() => {
		const groups = gsap.utils.toArray(
			'.contact__section .form__group, .big__button-wrapper'
		) as HTMLElement[];

		groups.forEach((el, index) => {
			gsap.from(el, {
				opacity: 0,
				yPercent: 50,
				duration: 1,
				ease: 'power1.out',
				delay: index * 0.1,
				scrollTrigger: {
					trigger: el,
					start: 'top 90%',
					end: 'bottom 0%',
					toggleActions: 'play none none none'
				}
			});
		});
	});
}

export function initContactPinAnimation(contactSection: HTMLElement): ScrollTrigger | null {
	if (!browser) return null;

	const footer = document.querySelector<HTMLElement>('.footer__section');
	if (!footer) return null;

	initScrambleTitle();

	const footerHeight = footer.offsetHeight;
	const slideOutDuration = contactSection.offsetHeight * 1.25;
	const totalDuration = footerHeight + slideOutDuration;

	let trigger: ScrollTrigger | null = null;

	const tl = gsap.timeline({
		scrollTrigger: {
			trigger: contactSection,
			start: 'bottom bottom',
			end: `+=${totalDuration}`,
			scrub: true,
			pin: contactSection,
			pinSpacing: false,
			id: 'contact-pin-slide',
			onRefresh(self) {
				trigger = self;
			}
		}
	});

	tl.to(contactSection, { duration: footerHeight, y: 0, ease: 'none' }, 0);
	tl.to(
		contactSection,
		{ duration: slideOutDuration, y: -contactSection.offsetHeight, ease: 'none' },
		footerHeight
	);

	// Return the trigger so the caller can kill it
	return ScrollTrigger.getById('contact-pin-slide') ?? null;
}
