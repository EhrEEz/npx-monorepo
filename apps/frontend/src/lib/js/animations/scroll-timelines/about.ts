import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
gsap.registerPlugin(SplitText, ScrollTrigger, ScrambleTextPlugin);

export function initAboutTimeline(): () => void {
	const ctx = gsap.context(() => {
		const aboutTimeline = gsap
			.timeline({
				scrollTrigger: {
					trigger: '.about__section',
					start: 'top 80%',
					toggleActions: 'play pause resume none'
				}
			})
			.addLabel('start');

		SplitText.create('.about__paragraph p', {
			type: 'lines',
			autoSplit: true,
			mask: 'lines',
			onSplit: (self) => {
				aboutTimeline.from(
					self.lines,
					{
						opacity: 0,
						duration: 0.5,
						yPercent: -100,
						stagger: { amount: 0.4 },
						ease: 'power1.out'
					},
					'start'
				);
			}
		});

		aboutTimeline
			.fromTo(
				'.about__title',
				{ opacity: 0 },
				{
					opacity: 1,
					duration: 1,
					scrambleText: { text: '{original}', chars: 'upperCase', revealDelay: 0.75, speed: 0.6 }
				},
				'start+=0.5'
			)
			.fromTo(
				'.about__link',
				{ opacity: 0, translateY: -12 },
				{ opacity: 1, translateY: 0, duration: 1, ease: 'power1.out' },
				'start+=0.7'
			);
	});

	return () => ctx.revert();
}
