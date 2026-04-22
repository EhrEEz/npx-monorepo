<script lang="ts">
	import Cubes from '$lib/components/AnimatedSVG/Cubes.svelte';
	import Diamonds from '$lib/components/AnimatedSVG/Diamonds.svelte';
	import Nepal from '$lib/components/AnimatedSVG/Nepal.svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { SplitText } from 'gsap/SplitText';
	import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
	import SEO from '$lib/components/SEO/SEO.svelte';
	import { initFloatingImages } from '$lib/js/animations/hover-image';

	const { data } = $props();
	const page_seo = $derived(data.page_seo);

	gsap.registerPlugin(SplitText, ScrollTrigger, ScrambleTextPlugin);

	$effect(() => {
		initFloatingImages();

		const headerTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: '.about__header',
				start: 'top bottom',
				toggleActions: 'play none none none'
			}
		});
		headerTimeline
			.addLabel('start')
			.from(
				'.about__logo',
				{
					opacity: 0,
					duration: 0.5,
					delay: 0.2,
					ease: 'power2.in'
				},
				'start+=0.2'
			)
			.to(
				'.about__intro-sub-heading',
				{
					duration: 0.8,
					opacity: 1,
					scrambleText: {
						text: '{original}',
						chars: 'upperAndLowerCase',
						revealDelay: 0.5,
						speed: 0.4
					}
				},
				'start+=0.3'
			)
			.from(
				'.about__introduction-title,.diamonds__wrapper',
				{
					opacity: 0,
					translateY: -30,
					stagger: 0.2,
					ease: 'power2.out'
				},
				'start+=0.4'
			);

		SplitText.create('.about__intro-paragraph', {
			type: 'lines',
			autoSplit: true,
			mask: 'lines',
			onSplit: (self) => {
				headerTimeline.from(
					self.lines,
					{
						duration: 1,
						opacity: 0,
						yPercent: 60,
						stagger: 0.1,
						ease: 'power2.out'
					},
					'start+=0.4'
				);
			}
		});

		const introductionTimeline = gsap
			.timeline({
				scrollTrigger: {
					trigger: '.about__introduction',
					start: 'top 30%',
					toggleActions: 'play none reverse reset'
				}
			})
			.addLabel('start');

		SplitText.create('.about__introduction-title', {
			type: 'lines',
			autoSplit: true,
			mask: 'lines',
			onSplit: (self) => {
				introductionTimeline.to(
					self.lines,
					{
						scrambleText: {
							text: '{original}',
							chars: 'upperCase',
							revealDelay: 0.5,
							speed: 0.4
						},
						stagger: {
							from: 'center',
							each: 0.1,
							ease: 'none'
						}
					},
					'start+=0.6'
				);
			}
		});

		const whyTimeline = gsap
			.timeline({
				scrollTrigger: {
					trigger: '.about__why',
					start: 'top 80%',
					toggleActions: 'play pause resume none'
				}
			})
			.addLabel('start');
		whyTimeline.from(
			'.about__why-sub-heading',
			{
				opacity: 0,
				scrambleText: {
					speed: 0.5,
					revealDelay: 0.35,
					text: '{original}',
					chars: 'upperCase'
				},
				ease: 'power1.out',
				duration: 0.5
			},
			'start'
		);
		SplitText.create('.about__why-heading', {
			type: 'lines,words',
			autoSplit: true,
			mask: 'lines',
			onSplit: (self) => {
				whyTimeline.from(
					self.words,
					{
						opacity: 0,
						scrambleText: {
							speed: 2,
							revealDelay: 0.2,
							text: '{original}',
							chars: 'upperCase'
						},
						stagger: {
							from: 'start',
							amount: 0.8
						},
						ease: 'power1.out',
						duration: 0.8
					},
					'start+=0.2'
				);
			}
		});
		SplitText.create('.about__why-paragraph', {
			type: 'lines',
			autoSplit: true,
			mask: 'lines',
			onSplit: (self) => {
				whyTimeline.from(
					self.lines,
					{
						duration: 1,
						opacity: 0,
						yPercent: 60,
						stagger: 0.1,
						ease: 'power2.out'
					},
					'start+=0.8'
				);
			}
		});
		const nepalTimeline = gsap
			.timeline({
				scrollTrigger: {
					trigger: '.about__nepal',
					start: 'top 40%',
					toggleActions: 'play none none none'
				}
			})
			.addLabel('nepal_start');

		nepalTimeline
			.from(
				'.about__nepal-sub-heading',
				{
					opacity: 0,
					scrambleText: {
						speed: 0.7,
						revealDelay: 0.35,
						text: '{original}',
						chars: 'upperCase'
					},
					ease: 'power1.out',
					duration: 0.4
				},
				'nepal_start'
			)
			.from(
				'.about__nepal-title',
				{
					opacity: 0,
					ease: 'ease',
					duration: 1
				},
				'nepal_start+=0.2'
			)
			.from(
				'.about__nepal-paragraph',
				{
					opacity: 0,
					ease: 'ease',
					duration: 1
				},
				'nepal_start+=0.4'
			)
			.from(
				'#rightAngleBracket',
				{
					opacity: 0,
					yPercent: -10,
					duration: 0.4,
					ease: 'ease.out'
				},
				'nepal_start+=0.6'
			)
			.from(
				'#slash',
				{
					opacity: 0,
					transformOrigin: 'center center',
					rotateZ: -10,
					duration: 0.8,
					ease: 'ease.out'
				},
				'nepal_start+=0.8'
			)
			.from(
				'#leftAngleBracket',
				{
					opacity: 0,
					yPercent: -10,
					duration: 0.4,
					ease: 'ease.out'
				},
				'nepal_start+=1'
			)
			.from(
				'#flag',
				{
					duration: 0.8,
					opacity: 0,
					ease: 'ease.in'
				},
				'nepal_start+=0.4'
			);
		const cubeSectionTimeline = gsap
			.timeline({
				scrollTrigger: {
					trigger: '.about__nepal-section2',
					start: 'top 80%',
					toggleActions: 'play none none none'
				},
				onComplete: startLoop
			})
			.addLabel('start');

		SplitText.create('.about__nepal-section2-title', {
			type: 'lines,words,chars',
			autoSplit: true,
			mask: 'lines',
			onSplit: (self) => {
				cubeSectionTimeline.from(
					self.chars,
					{
						opacity: 0,
						yPercent: 100,
						ease: 'power3.out',
						stagger: {
							amount: 0.5,
							from: 'end'
						}
					},
					'start+=0.6'
				);
			}
		});
		cubeSectionTimeline.from(
			'.cube-svg',
			{
				opacity: 0,
				xPercent: -50,
				duration: 0.6,
				stagger: {
					amount: 0.2,
					from: 'start'
				},
				ease: 'circ.out'
			},
			'start+=0.3'
		);
		function startLoop() {
			gsap.to('.cube-svg', {
				opacity: 0.2,
				yPercent: -10,
				duration: 0.6,
				yoyo: true,
				repeat: -1,
				yoyoEase: 'sine.out',
				repeatDelay: 0.2,
				ease: 'sine.out',
				stagger: {
					amount: 0.4,
					from: 'start'
				}
			});
		}

		const whatTimeline = gsap
			.timeline({
				scrollTrigger: {
					trigger: '.about__build',
					start: 'top 80%',
					toggleActions: 'play none none none'
				}
			})
			.addLabel('start');
		whatTimeline
			.fromTo(
				'.about__build-sub-title',
				{
					opacity: 0
				},
				{
					duration: 0.8,
					opacity: 1,
					scrambleText: {
						text: '{original}',
						chars: 'upperAndLowerCase',
						revealDelay: 0.5,
						speed: 0.4
					}
				},
				'start'
			)
			.from(
				'.about__build-title',
				{
					opacity: 0,
					yPercent: -10,
					duration: 0.6,
					ease: 'power2.out'
				},
				'start'
			);
		gsap.from('.card__what', {
			scrollTrigger: {
				trigger: '.card__what', // Use 'el' to trigger based on this specific item
				start: 'top 80%', // When the top of the element hits 80% of viewport
				toggleActions: 'play none none none'
			},
			opacity: 0,
			xPercent: 10,
			stagger: {
				each: 0.1,
				from: 'random'
			},
			duration: 0.4,
			ease: 'sine.out'
		});
		SplitText.create('.approach__text', {
			type: 'lines',
			autoSplit: true,
			linesClass: 'line',
			onSplit: (splitText) => {
				const lines = splitText.lines;
				return gsap.to(lines, {
					stagger: 1,
					duration: 1.5,
					ease: 'none',
					backgroundSize: '100%',
					scrollTrigger: {
						trigger: lines,
						start: 'center 80%',
						end: 'center 20%',
						scrub: true
					}
				});
			}
		});

		const operatingTimeline = gsap
			.timeline({
				scrollTrigger: {
					trigger: '.about__operating',
					start: 'top 80%',
					toggleActions: 'play none none none'
				}
			})
			.addLabel('start');
		operatingTimeline.fromTo(
			'.about__operating-sub-title',
			{
				opacity: 0
			},
			{
				duration: 0.8,
				opacity: 1,
				scrambleText: {
					text: '{original}',
					chars: 'upperAndLowerCase',
					revealDelay: 0.5,
					speed: 0.4
				}
			},
			'start'
		);
		gsap.from('.model__item', {
			scrollTrigger: {
				start: 'top 70%',
				trigger: '.model__item',
				toggleActions: 'play none none none'
			},
			opacity: 0,
			x: -40,
			duration: 0.6,
			ease: 'ease.out',
			stagger: 0.2
		});
		gsap.utils.toArray('.about__drive-paragraph').forEach((em: unknown) => {
			gsap.from(em as GSAPTweenTarget, {
				opacity: 0,
				duration: 1,
				ease: 'ease',
				scrollTrigger: {
					trigger: em as HTMLElement,
					start: 'top 70%',
					toggleActions: 'play none none none'
				}
			});
		});
		SplitText.create('.about__drive-blockquote', {
			type: 'chars,words,lines',
			mask: 'lines',
			autoSplit: true,
			onSplit: (self) => {
				gsap.fromTo(
					self.chars,
					{
						yPercent: 200
					},
					{
						yPercent: 0,
						// opacity: 1,
						scrambleText: {
							text: '{original}',
							chars: 'upperAndLowerCase',
							revealDelay: 0.5,
							speed: 0.3
						},
						scrollTrigger: {
							trigger: '.about__drive-blockquote',
							start: 'top 80%',
							toggleActions: 'play pause none none'
						},
						ease: 'sine.out',
						stagger: {
							each: 0.02,
							from: 'random'
						}
					}
				);
			}
		});
	});
</script>

<h1 class="sr-only">About Us</h1>
<SEO pageSettings={page_seo} />
<section
	class="about__header pt-md-12 full-width content-grid pb-md- pb-lg-3 mt-8 mt-md-0"
	data-section="dark"
>
	<div class="grid-row jc-md-center">
		<div
			class="order-md-1 col-12 col-md-5 col-start-lg-9 col-end-lg-13 col-start-xl-10 about__heading mb-5 mb-md-0"
		>
			<h2
				class="bold-15 uppercase text-right font-mono neutral-400 about-sub-heading about__intro-sub-heading"
			>
				Who we are
			</h2>
		</div>
		<div class="col-12 col-md-7 col-lg-5 col-xl-4">
			<div class="about__logo mb-2 neutral-100">
				<svg width="130" viewBox="0 0 69 19" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M0 4.37154H2.01887V5.93349H2.3394C2.52625 5.51173 2.85892 5.11724 3.33895 4.7516C3.81899 4.38597 4.53144 4.20316 5.47783 4.20316C6.22371 4.20316 6.88754 4.37956 7.46783 4.73076C8.04812 5.08195 8.50386 5.57908 8.83805 6.21894C9.17074 6.85879 9.33784 7.63015 9.33784 8.52979V14.7776H7.27795V8.69818C7.27795 7.79853 7.06376 7.13302 6.63841 6.70324C6.21155 6.27346 5.62518 6.06018 4.87931 6.06018C4.02558 6.06018 3.34351 6.35525 2.83006 6.947C2.31661 7.53874 2.05989 8.39669 2.05989 9.52245V14.7776H0V4.37154Z"
						fill="currentColor"
					/>
					<path
						d="M16.0157 15.0727C15.0162 15.0727 14.1427 14.8514 13.3968 14.4072C12.6494 13.9646 12.0676 13.3375 11.6468 12.5293C11.2276 11.7211 11.0164 10.7813 11.0164 9.71168V9.4583C11.0164 8.37424 11.223 7.42809 11.6362 6.61985C12.0494 5.81161 12.6251 5.18459 13.3649 4.74198C14.1047 4.29938 14.9615 4.07647 15.9337 4.07647C16.9059 4.07647 17.7095 4.29777 18.4235 4.74198C19.1359 5.18459 19.6935 5.80039 20.093 6.58938C20.4925 7.37838 20.693 8.29887 20.693 9.35407V10.1767H13.1158C13.1416 11.0924 13.4318 11.8205 13.9862 12.3609C14.5392 12.9029 15.2289 13.174 16.0552 13.174C16.8285 13.174 17.4118 12.9911 17.8052 12.6255C18.1987 12.2599 18.501 11.8381 18.7152 11.3586L20.415 12.2871C20.2282 12.6816 19.9578 13.097 19.6053 13.5332C19.2514 13.9694 18.7881 14.335 18.2154 14.6301C17.6427 14.9251 16.909 15.0727 16.0157 15.0727ZM13.1371 8.50895H18.5952C18.542 7.72156 18.2746 7.10576 17.7961 6.66155C17.3161 6.21894 16.6887 5.99603 15.917 5.99603C15.1453 5.99603 14.5134 6.21734 14.0273 6.66155C13.5411 7.10415 13.2434 7.71995 13.1371 8.50895Z"
						fill="currentColor"
					/>
					<path
						d="M22.3731 4.37154H24.392V5.86934H24.7125C24.9662 5.40429 25.349 4.99055 25.8625 4.62331C26.3759 4.25768 27.1127 4.07486 28.0712 4.07486C28.8976 4.07486 29.6541 4.28655 30.3407 4.70831C31.0274 5.13006 31.5803 5.73945 31.9996 6.53486C32.4189 7.33027 32.63 8.29085 32.63 9.41661V9.73253C32.63 10.8583 32.4234 11.8189 32.0102 12.6143C31.597 13.4097 31.0441 14.0175 30.3514 14.4408C29.6587 14.8626 28.8976 15.0743 28.0727 15.0743C27.4332 15.0743 26.8924 14.9893 26.4534 14.8209C26.0129 14.6525 25.6604 14.4376 25.3931 14.1778C25.1257 13.918 24.913 13.647 24.7535 13.3648H24.433V19H22.3731V4.37154ZM27.4712 13.1723C28.3781 13.1723 29.1179 12.8693 29.6906 12.2647C30.2633 11.6601 30.5504 10.7941 30.5504 9.66838V9.47915C30.5504 8.36783 30.2602 7.50987 29.6799 6.9037C29.0996 6.29912 28.3629 5.99603 27.4712 5.99603C26.5795 5.99603 25.8609 6.29912 25.2822 6.9037C24.7019 7.50827 24.4117 8.36783 24.4117 9.47915V9.66838C24.4117 10.7941 24.7019 11.6601 25.2822 12.2647C25.8625 12.8693 26.5916 13.1723 27.4712 13.1723Z"
						fill="currentColor"
					/>
					<path
						d="M37.4486 15.0727C36.7422 15.0727 36.1118 14.946 35.5588 14.6926C35.0059 14.4392 34.5653 14.0672 34.2387 13.5733C33.9121 13.0809 33.7496 12.4828 33.7496 11.7788C33.7496 11.0748 33.9121 10.467 34.2387 9.99553C34.5653 9.52405 35.0119 9.16965 35.5786 8.9291C36.1452 8.69016 36.7877 8.56988 37.5078 8.56988H40.5065V7.89475C40.5065 7.29018 40.3333 6.80427 39.9869 6.43864C39.6406 6.07301 39.1074 5.89019 38.3873 5.89019C37.6673 5.89019 37.1402 6.06659 36.768 6.41779C36.3943 6.76899 36.1482 7.22763 36.0282 7.78891L34.1081 7.13462C34.2676 6.57174 34.5243 6.06178 34.8783 5.60474C35.2307 5.1477 35.7016 4.77887 36.288 4.49662C36.8743 4.21599 37.5807 4.07486 38.4071 4.07486C39.6862 4.07486 40.6933 4.41965 41.4255 5.10922C42.1592 5.79878 42.5253 6.77701 42.5253 8.04389V12.3288C42.5253 12.7506 42.7122 12.9623 43.0859 12.9623H43.9259V14.7776H42.3871C41.9207 14.7776 41.541 14.6509 41.2478 14.3975C40.9546 14.1442 40.8073 13.7994 40.8073 13.3632V13.299H40.508C40.4017 13.5107 40.2406 13.7561 40.028 14.0383C39.8138 14.3206 39.5008 14.5627 39.0876 14.7664C38.6745 14.97 38.1276 15.0727 37.4486 15.0727ZM37.7478 13.2782C38.5742 13.2782 39.2411 13.028 39.7469 12.5293C40.2528 12.0306 40.5065 11.3442 40.5065 10.4718V10.2601H37.6278C37.0809 10.2601 36.6419 10.3836 36.3077 10.629C35.975 10.8759 35.8079 11.2384 35.8079 11.7162C35.8079 12.1941 35.9811 12.5742 36.3275 12.8564C36.6738 13.1387 37.1478 13.2782 37.7463 13.2782H37.7478Z"
						fill="currentColor"
					/>
					<path
						d="M44.687 14.776L48.4467 9.52085L44.7675 4.36994H47.1874L49.7668 8.10643H50.0874L52.6668 4.36994H55.1064L51.4074 9.52085L55.1672 14.776H52.7078L50.0889 10.9561H49.7684L47.1494 14.776H44.687Z"
						fill="currentColor"
					/>
					<path
						d="M57.6235 2.95712C57.224 2.95712 56.8868 2.81921 56.6134 2.54499C56.3399 2.27076 56.2032 1.91475 56.2032 1.47856C56.2032 1.04237 56.3399 0.686361 56.6134 0.412137C56.8868 0.137914 57.2225 0 57.6235 0C58.0246 0 58.377 0.137914 58.6429 0.412137C58.9087 0.686361 59.0424 1.04237 59.0424 1.47856C59.0424 1.91475 58.9087 2.27076 58.6429 2.54499C58.3755 2.81921 58.0367 2.95712 57.6235 2.95712ZM56.5845 14.7776V4.37154H58.6444V14.7776H56.5845Z"
						fill="currentColor"
					/>
					<path
						d="M64.941 15.0727C63.6878 15.0727 62.6487 14.7776 61.8223 14.1859C60.9959 13.5941 60.4885 12.7009 60.3032 11.5046L62.2233 11.0187C62.3297 11.596 62.5105 12.053 62.7626 12.3914C63.0163 12.7297 63.3323 12.9687 63.7121 13.1082C64.0918 13.2493 64.502 13.3199 64.941 13.3199C65.5942 13.3199 66.097 13.1868 66.451 12.919C66.8034 12.6512 66.9811 12.3064 66.9811 11.8846C66.9811 11.4629 66.814 11.1534 66.4813 10.9561C66.1487 10.7589 65.655 10.5969 65.0018 10.4702L64.3212 10.3435C63.6543 10.2168 63.0482 10.034 62.5013 9.79507C61.9545 9.55613 61.5215 9.22578 61.2025 8.80241C60.882 8.38066 60.7225 7.83862 60.7225 7.17792C60.7225 6.19328 61.0688 5.42995 61.7615 4.88791C62.4543 4.34588 63.3748 4.07486 64.5202 4.07486C65.6656 4.07486 66.536 4.33947 67.25 4.86707C67.9625 5.39467 68.4258 6.10989 68.64 7.00954L66.7198 7.57883C66.5998 6.94539 66.3461 6.49958 65.9603 6.23818C65.5729 5.97839 65.0929 5.8485 64.5202 5.8485C63.9475 5.8485 63.5206 5.95755 63.2001 6.17564C62.8796 6.39374 62.7201 6.70003 62.7201 7.09453C62.7201 7.51629 62.8765 7.82579 63.1895 8.02304C63.5024 8.22029 63.9262 8.36783 64.4594 8.46565L65.1597 8.59234C65.8661 8.71902 66.5133 8.89542 67.0996 9.11994C67.686 9.34605 68.1493 9.66838 68.4896 10.0901C68.8299 10.5119 69 11.0748 69 11.7788C69 12.8212 68.6324 13.6294 67.9002 14.2067C67.1665 14.784 66.1806 15.0727 64.941 15.0727Z"
						fill="currentColor"
					/>
				</svg>
				<span class="sr-only">Nepaxis</span>
			</div>
			<p class="regular-15 neutral-300 about__intro-paragraph">
				Nepaxis Technologies is a UAE-registered technology company built on a simple but powerful
				conviction: that world-class engineering should be accessible, accountable, and built to
				last.
			</p>
		</div>
	</div>
</section>
<section class="about__introduction py-4 pt-md-8 pt-lg-9" data-section="dark">
	<div class="grid-row about__introduction-grid">
		<div class="col-12 col-start-md-5 col-end-md-13 col-lg-5 col-xl-6">
			<div class="diamonds__wrapper mb-4 mb-md-8">
				<Diamonds />
			</div>
		</div>
		<div class="col-12 col-md-9 col-lg-7 col-xl-6 about-title-wrapper">
			<p class="about-title about-24 about__introduction-title">
				Headquartered in Dubai and operating a dedicated engineering hub in Nepal, we exist at the
				intersection of global ambition and technical excellence, serving enterprises, scale-ups,
				and governments across 15+ countries who demand more than vendors. They demand partners.
			</p>
		</div>
	</div>
</section>
<section class="about__why py-6 py-md-8 pt-md-4 py-2xl-12" data-section="dark">
	<h2
		class="text-right bold-15 uppercase font-mono neutral-400 about-sub-heading mb-4 mb-md-6 about__why-sub-heading"
	>
		Why we exist
	</h2>
	<div class="grid-row h-lg-full row-gap-md-2">
		<div class="col-12 col-ms-10 col-start-md-4 col-end-md-13 col-lg-5 col-start-xl-2 col-end-xl-6">
			<p class="about-title about-24 about__why-heading mb-3 mb-md-0">
				We built Nepaxis to be the antidote to overpromised and underdelivered technology services
				across the globe.
			</p>
		</div>
		<div
			class="col-12 col-ms-11 col-start-md-4 col-end-md-11 col-start-lg-7 col-end-lg-13 col-start-xl-7 col-end-xl-11"
		>
			<p class="regular-15 neutral-300 about__why-paragraph">
				Our model is deliberate: a commercially sharp presence in Dubai - one of the world's most
				dynamic business capitals, backed by a high-caliber engineering team rooted in Nepal's
				rapidly emerging technology ecosystem.
			</p>
		</div>
	</div>
</section>
<section class="about__nepal full-width content-grid">
	<div class="full-width bg-neutral-100 py-7 py-lg-12" data-section="light">
		<div class="content-grid">
			<div class="grid-row row-gap-md-7">
				<div class="col-12 col-start-lg-8 col-end-lg-13 col-end-xl-12 order-lg-1">
					<h2
						class="text-right bold-15 uppercase font-mono neutral-300 about-sub-heading mb-6 about__nepal-sub-heading"
					>
						The Nepali Engineering Advantage
					</h2>
					<div class="mb-6 mb-md-0 px-md-7 px-lg-0">
						<Nepal />
					</div>
				</div>
				<div
					class="col-12 col-ms-10 col-start-md-2 col-end-md-10 col-start-lg-1 col-start-2xl-2 col-end-lg-6"
				>
					<p class="about-title about-24 mb-3 neutral-1000 about__nepal-title">
						Nepal's technology talent pool is one of Asia's best-kept secrets, and we intend to keep
						leveraging it.
					</p>
					<p class="regular-15 neutral-600 about__nepal-paragraph">
						Our model is deliberate: a commercially sharp presence in Dubai - one of the world's
						most dynamic business capitals, backed by a high-caliber engineering team rooted in
						Nepal's rapidly emerging technology ecosystem.
					</p>
				</div>
			</div>
		</div>
	</div>
	<div
		class="grid-row ac-center row-gap-md-10 py-7 py-md-9 py-lg-12 about__nepal-section2"
		data-section="dark"
	>
		<div class="col-12 col-md-8 col-lg-5 order-1 order-md-0">
			<div class="fl-row jc-center jc-lg-start jc-2xl-center">
				<Cubes />
			</div>
		</div>
		<div
			class="col-12 col-start-md-5 col-end-md-13 col-start-lg-7 col-end-lg-13 order-0 order-md-1"
		>
			<p class="about-title medium-3 about__nepal-section2-title mb-4 mb-md-0">
				When you work with Nepaxis, you get engineers who own their work, the real builders.
			</p>
		</div>
	</div>
</section>
<section class="about__build pb-6 pb-md-8 pb-2xl-12" data-section="dark">
	<h2
		class="text-right bold-15 uppercase font-mono neutral-400 about__build-sub-title about-sub-heading mb-6"
	>
		What we build
	</h2>
	<div class="grid-row gap-md-4">
		<div class="col-12 col-md-8 col-start-lg-2 col-end-lg-7 col-end-2xl-5">
			<p class="about-title about-24 mb-3 about__build-title">
				We operate across the full digital stack across 15+ countries
			</p>
		</div>
		<div class="col-12 col-start-lg-2 col-end-lg-12">
			<ul class="grid__what gap-1 gap-lg-2">
				<li class="card__what">Brand Identity</li>
				<li class="card__what">Product Design</li>
				<li class="card__what">DevOps</li>
				<li class="card__what">E-Commerce</li>
				<li class="card__what">SAAS</li>
				<li class="card__what">Government Enterprise Systems</li>
				<li class="card__what">Cloud Architecture</li>
			</ul>
		</div>
	</div>
</section>
<section
	class="capabilities__section bg-neutral-100 full-width content-grid py-7 py-md-8 py-lg-9"
	data-section="light"
	id="services-section"
	aria-labelledby="#services-title"
>
	<h2 class="heading-2 neutral-700 mb-2 mb-md-4 services__title" id="services-title">
		Capabilities
	</h2>
	<div class="grid-xl-row gap-3xl-9">
		<div class="col-xl-8">
			<table class="capabilities__table--sm regular-14 mb-4">
				<tbody>
					<tr>
						<th colspan="1" class="text-left uppercase bold-14 neutral-600">Design</th>
					</tr>
					<tr>
						<td class="single-column-description">
							<p class="neutral-500 regular-14">
								We create cohesive brand systems and intuitive digital experiences that elevate how
								your business is perceived across every touchpoint.
							</p>
						</td>
					</tr>
					<tr>
						<td class="single-column-service">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Branding & Visual Identity
							</span>
						</td>
					</tr>
					<tr>
						<td class="single-column-service">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								UI/UX Design
							</span>
						</td>
					</tr>
					<tr>
						<td class="single-column-service">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Digital & Print Media
							</span>
						</td>
					</tr>

					<tr>
						<th colspan="1" class="text-left uppercase bold-14 neutral-600">Development</th>
					</tr>
					<tr>
						<td class="single-column-description">
							<p class="neutral-500 regular-14">
								Our engineering team builds high-performance digital products using modern
								frameworks, scalable architecture, and efficient development practices.
							</p>
						</td>
					</tr>
					<tr>
						<td class="single-column-service">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Web Development
							</span>
						</td>
					</tr>
					<tr>
						<td class="single-column-service">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Mobile App Development
							</span>
						</td>
					</tr>
					<tr>
						<td class="single-column-service">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Software Development
							</span>
						</td>
					</tr>
					<tr>
						<td class="single-column-service">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Tech Stack Expertise
							</span>
						</td>
					</tr>

					<tr>
						<th colspan="1" class="text-left uppercase bold-14 neutral-600"
							>Cloud & Data Services</th
						>
					</tr>
					<tr>
						<td class="single-column-description">
							<p class="neutral-500 regular-14">
								Our engineering team builds high-performance digital products using modern
								frameworks, scalable architecture, and efficient development practices.
							</p>
						</td>
					</tr>
					<tr>
						<td class="single-column-service">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Cloud & AWS Services
							</span>
						</td>
					</tr>
					<tr>
						<td class="single-column-service">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								DevOps & Infrastructure
							</span>
						</td>
					</tr>
					<tr>
						<td class="single-column-service">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Data & Analytics
							</span>
						</td>
					</tr>

					<tr>
						<th colspan="1" class="text-left uppercase bold-14 neutral-600">Marketing & Growth</th>
					</tr>
					<tr>
						<td class="single-column-description">
							<p class="neutral-500 regular-14">
								We execute data-driven marketing strategies that improve visibility, accelerate
								acquisition, and enhance long-term customer engagement.
							</p>
						</td>
					</tr>
					<tr>
						<td class="single-column-service">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Growth Hacking
							</span>
						</td>
					</tr>
					<tr>
						<td class="single-column-service">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Search & Performance Marketing
							</span>
						</td>
					</tr>
					<tr>
						<td class="single-column-service">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Social Media Marketing
							</span>
						</td>
					</tr>
					<tr>
						<td class="single-column-service">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Content & Brand marketing
							</span>
						</td>
					</tr>
					<tr>
						<td class="single-column-service">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Analytics & Reporting
							</span>
						</td>
					</tr>

					<tr>
						<th colspan="1" class="text-left uppercase bold-14 neutral-600">Expert Services</th>
					</tr>
					<tr>
						<td class="single-column-description">
							<p class="neutral-500 regular-14">
								Our strategic and operational support ensures that every digital initiative is
								planned, executed, and maintained with precision and clarity.
							</p>
						</td>
					</tr>
					<tr>
						<td class="single-column-service">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Consulting & Support
							</span>
						</td>
					</tr>
				</tbody>
			</table>
			<table class="capabilities__table--md regular-14 mb-md-4">
				<tbody>
					<tr>
						<th colspan="2" class="text-left uppercase bold-14 neutral-600">Design</th>
					</tr>
					<tr>
						<td rowspan="3">
							<p class="neutral-500 regular-14">
								We create cohesive brand systems and intuitive digital experiences that elevate how
								your business is perceived across every touchpoint.
							</p>
						</td>
						<td class="floating__image-wrapper" data-img="/images/service/branding-visual.png">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Branding & Visual Identity
							</span>
						</td>
					</tr>
					<tr>
						<td class="floating__image-wrapper" data-img="/images/service/ui-ux-design.png">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								UI/UX Design
							</span>
						</td>
					</tr>
					<tr>
						<td class="floating__image-wrapper" data-img="/images/service/digital-print-media.png">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Digital & Print Media
							</span>
						</td>
					</tr>
					<tr>
						<th colspan="2" class="text-left uppercase bold-14 neutral-600">Development</th>
					</tr>
					<tr>
						<td rowspan="4">
							<p class="neutral-500 regular-14">
								Our engineering team builds high-performance digital products using modern
								frameworks, scalable architecture, and efficient development practices.
							</p>
						</td>
						<td class="floating__image-wrapper" data-img="/images/service/web-development.png">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Web Development
							</span>
						</td>
					</tr>
					<tr>
						<td class="floating__image-wrapper" data-img="/images/service/mobile-development.png">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Mobile App Development
							</span>
						</td>
					</tr>
					<tr>
						<td class="floating__image-wrapper" data-img="/images/service/software-development.png">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Software Development
							</span>
						</td>
					</tr>
					<tr>
						<td class="floating__image-wrapper" data-img="/images/service/expert.png">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Tech Stack Expertise
							</span>
						</td>
					</tr>
					<tr>
						<th colspan="2" class="text-left uppercase bold-14 neutral-600"
							>Cloud & Data Services</th
						>
					</tr>
					<tr>
						<td rowspan="3">
							<p class="neutral-500 regular-14">
								Our engineering team builds high-performance digital products using modern
								frameworks, scalable architecture, and efficient development practices.
							</p>
						</td>
						<td class="floating__image-wrapper" data-img="/images/service/cloud.png">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Cloud & AWS Services
							</span>
						</td>
					</tr>
					<tr>
						<td class="floating__image-wrapper" data-img="/images/service/dev-ops.png">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								DevOps & Infrastructure
							</span>
						</td>
					</tr>
					<tr>
						<td class="floating__image-wrapper" data-img="/images/service/analytics.png">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Data & Analytics
							</span>
						</td>
					</tr>
					<tr>
						<th colspan="2" class="text-left uppercase bold-14 neutral-600">Marketing & Growth</th>
					</tr>
					<tr>
						<td rowspan="5">
							<p class="neutral-500 regular-14">
								We execute data-driven marketing strategies that improve visibility, accelerate
								acquisition, and enhance long-term customer engagement.
							</p>
						</td>
						<td class="floating__image-wrapper" data-img="/images/service/growth-hacking.png">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Growth Hacking
							</span>
						</td>
					</tr>
					<tr>
						<td class="floating__image-wrapper" data-img="/images/service/seo.png">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Search & Performance Marketing
							</span>
						</td>
					</tr>
					<tr>
						<td class="floating__image-wrapper" data-img="/images/service/social-media.png">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Social Media Marketing
							</span>
						</td>
					</tr>
					<tr>
						<td class="floating__image-wrapper" data-img="/images/service/content-marketing.png">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Content & Brand marketing
							</span>
						</td>
					</tr>
					<tr>
						<td class="floating__image-wrapper" data-img="/images/service/data-reporting.png">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Analytics & Reporting
							</span>
						</td>
					</tr>
					<tr>
						<th colspan="2" class="text-left uppercase bold-14 neutral-600">Expert Services</th>
					</tr>
					<tr>
						<td rowspan="3">
							<p class="neutral-500 regular-14">
								Our strategic and operational support ensures that every digital initiative is
								planned, executed, and maintained with precision and clarity.
							</p>
						</td>
						<td class="floating__image-wrapper" data-img="/images/service/support.png">
							<span class="font-mono neutral-600 uppercase regular-14 floating__image-text">
								Consulting & Support
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="col-xl-4">
			<div class="capabilities__aside">
				<div class="brochure__content">
					<div class="services__paragraph paragraph-wrapper neutral-500 tracking-tight pe-lg-4">
						<p>
							You can catch all the details of our servcies by downloading our service brochure
							below.
						</p>
					</div>
					<a
						href="https://drive.google.com/uc?export=download&id=1x1kVPoeZaI9VFPjU6xvle9SePYs8-nWH"
						class="btn--black services__button mb-4 mb-lg-5"
						target="_blank"
					>
						<span class="btn__wrapper">
							<span class="btn__text">Download Brochure</span>
							<span class="btn__icon">
								<svg
									width="13"
									height="13"
									viewBox="0 0 13 13"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M1 10.2915V8.125C1 7.77982 1.27982 7.5 1.625 7.5C1.97018 7.5 2.25 7.77982 2.25 8.125V10.2915C2.25 10.4131 2.29832 10.5298 2.38428 10.6157C2.47023 10.7017 2.58694 10.75 2.7085 10.75H10.2915C10.4131 10.75 10.5298 10.7017 10.6157 10.6157C10.7017 10.5298 10.75 10.4131 10.75 10.2915V8.125C10.75 7.77982 11.0298 7.5 11.375 7.5C11.7202 7.5 12 7.77982 12 8.125V10.2915C12 10.7446 11.8199 11.1791 11.4995 11.4995C11.1791 11.8199 10.7446 12 10.2915 12H2.7085C2.25542 12 1.82086 11.8199 1.50049 11.4995C1.18011 11.1791 1 10.7446 1 10.2915ZM5.875 1.625C5.875 1.27982 6.15482 1 6.5 1C6.84518 1 7.125 1.27982 7.125 1.625V6.61621L8.7666 4.97461C9.01069 4.73069 9.40637 4.73059 9.65039 4.97461C9.89441 5.21863 9.89431 5.61431 9.65039 5.8584L6.94189 8.56689C6.69782 8.81097 6.30218 8.81097 6.05811 8.56689L3.34961 5.8584C3.10569 5.61431 3.10559 5.21863 3.34961 4.97461C3.59363 4.73059 3.98931 4.73069 4.2334 4.97461L5.875 6.61621V1.625Z"
										fill="currentColor"
									/>
								</svg>
							</span>
						</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
<section
	class="about__main fl-row jc-center al-center pt-7 pt-md-10 pb-3 pt-xl-12"
	data-section="dark"
>
	<h2 class="heading-xl text-center approach__text">
		<div>Scalable By Design</div>
		<div>Secure by Default</div>
		<div>Maintained with Discipline</div>
	</h2>
</section>

<section class="about__operating py-5 py-md-8 pt-xl-12 pb-xl-2" data-section="dark">
	<h2
		class="text-right bold-15 uppercase font-mono neutral-400 about-sub-heading mb-4 mb-md-6 about__operating-sub-title"
	>
		Operating Model
	</h2>
	<div class="grid-row gap-4 gap-md-2 gap-lg-0">
		<div class="col-12 col-md-6 col-start-lg-2 col-end-lg-6 model__item">
			<h3 class="regular-15 tracking-ultra-wide uppercase neutral-300 mb-3">Dubai</h3>
			<p class="regular-24 neutral-200">
				Dubai gives us proximity to clients across the GCC, Europe, and beyond - the trust, the
				timezone, and the commercial infrastructure to engage at an enterprise level.
			</p>
		</div>
		<div class="col-12 col-md-6 col-start-lg-7 col-end-lg-11 model__item">
			<h3 class="regular-15 tracking-ultra-wide uppercase neutral-300 mb-3">Nepal</h3>
			<p class="regular-24 neutral-200">
				Nepal gives us the engineering depth to deliver without compromise.
			</p>
		</div>
	</div>
</section>

<section class="about__drive pb-8 py-lg-12" data-section="dark">
	<div class="grid-row">
		<div class="col-12 col-md-10 col-start-lg-5 col-end-lg-10">
			<p class="regular-15 neutral-300 about__drive-paragraph">
				We are not interested in building digital products that look good in a pitch deck and fall
				apart in production. Every system we architect, every team we assemble, and every product we
				build is built with one question in mind:
			</p>
		</div>
		<div class="col-12 col-md-10 col-start-lg-3 col-end-lg-8">
			<blockquote class="about-title medium-3 my-3 about__drive-blockquote">
				Will this still be an asset for our client in five years?
			</blockquote>
		</div>
		<div class="col-12 col-start-lg-5 col-end-lg-10">
			<p class="regular-15 neutral-300 about__drive-paragraph">
				That is the Nepaxis standard. And it is non-negotiable.
			</p>
		</div>
	</div>
</section>

<style lang="scss">
	.grid__what {
		display: grid;
		grid-template-columns: repeat(2, 1fr);

		@media screen and (width >= 768px) {
			grid-template-columns: repeat(4, 1fr);
		}
		@media screen and (width >= 1200px) {
			grid-template-columns: repeat(10, 1fr);
		}
	}
	.card__what {
		font-family: 'Space Mono';
		text-transform: uppercase;
		display: flex;
		padding: 0.875em;
		aspect-ratio: 1/1;
		border: 1px solid var(--clr-neutral-500);
		background: var(--clr-neutral-600);
		font-size: 0.875rem;
		hyphens: auto;

		@media screen and (width >= 768px) {
			&:nth-child(1),
			&:nth-child(3),
			&:nth-child(6) {
				grid-column: 1;
			}
			&:nth-child(2),
			&:nth-child(4) {
				grid-column: 3;
			}
			&:nth-child(5) {
				grid-column: 4;
			}
			&:nth-child(7) {
				grid-column: 2;
			}
		}

		@media screen and (width >= 1200px) {
			padding: 0.875em;
			grid-column: span 2;
			&:nth-child(1),
			&:nth-child(3),
			&:nth-child(6) {
				grid-column: 1 / 3;
			}
			&:nth-child(2),
			&:nth-child(4) {
				grid-column: 5 / 7;
			}
			&:nth-child(5) {
				grid-column: 7 / 9;
			}
			&:nth-child(7) {
				grid-column: 3 / 5;
			}
		}
	}
	.about-sub-heading {
		letter-spacing: 0.09rem;
	}
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

	.about__header {
		align-content: end;
	}
	.about__introduction-grid {
		justify-items: stretch;
	}
	:global(.diamonds__wrapper) {
		display: flex;
		justify-content: center;
		svg {
			inline-size: 100%;
		}
	}
</style>
