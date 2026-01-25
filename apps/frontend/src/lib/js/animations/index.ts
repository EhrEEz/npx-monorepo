import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSmoothScroll } from './smooth-scroll';
import { initLazyLoadImages } from './lazy-load';
import { initHeaderAnimations } from './header-animations';
import { initDraggable } from './draggable';
import { initShuffleButtonHover } from './shuffle';

import { initHeroTimeline } from './scroll-timelines/hero';
import { initAboutTimeline } from './scroll-timelines/about';
import { initAsciiTimeline } from './scroll-timelines/logo';
import { initCapabilitiesTimeline } from './scroll-timelines/capabilities';
import { initApproachSectionAnimations } from './scroll-timelines/approach';
import { initContactTimeline } from './scroll-timelines/contact';
import { initFooterTimeline } from './scroll-timelines/footer';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
	initSmoothScroll();
	initLazyLoadImages();
	initHeaderAnimations();
	initShuffleButtonHover();
	initDraggable();
	initFooterTimeline();

	document.fonts.ready.then(() => {
		initHeroTimeline();
		initApproachSectionAnimations();
		initAboutTimeline();
		initAsciiTimeline();
		initCapabilitiesTimeline();
		initContactTimeline();
	});

	window.addEventListener('resize', () => {
		initHeaderAnimations();
	});
}
