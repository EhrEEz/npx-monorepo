<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import gsap from 'gsap';

	export interface CarouselSlide {
		id?: string | number;
		content: any;
		[key: string]: any;
	}

	interface Props {
		slides: CarouselSlide[];
		autoplay?: boolean;
		autoplayInterval?: number;
		loop?: boolean;
		showNavigation?: boolean;
		showPagination?: boolean;
		depthEffect?: boolean;
		depthScale?: number;
		autoscroll?: boolean;
		autoscrollSpeed?: number;
		cardMode?: boolean;
		cardVisibleCount?: number;
		class?: string;
	}

	let {
		slides = [],
		autoplay = false,
		autoplayInterval = 4000,
		loop = false,
		showNavigation = true,
		showPagination = true,
		depthEffect = true,
		depthScale = 0.85,
		autoscroll = false,
		autoscrollSpeed = 1,
		cardMode = false,
		cardVisibleCount = 3,
		class: className = ''
	}: Props = $props();

	let container: HTMLElement;
	let track: HTMLElement;
	let slideElements: HTMLElement[] = [];
	let autoplayTimer: any = null;
	let autoscrollTween: gsap.core.Tween | null = null;
	let currentIndex = $state(0);
	let isTransitioning = $state(false);
	let isPaused = $state(false);
	let tl: gsap.core.Timeline | null = null;

	const totalSlides = $derived(slides.length);
	const effectiveIndex = $derived(cardMode ? currentIndex % totalSlides : currentIndex);

	function clampIndex(index: number): number {
		if (cardMode && loop) {
			return ((index % totalSlides) + totalSlides) % totalSlides;
		}
		if (loop) {
			return ((index % totalSlides) + totalSlides) % totalSlides;
		}
		return Math.max(0, Math.min(index, totalSlides - 1));
	}

	function goToSlide(index: number, direction?: 'left' | 'right'): void {
		if (isTransitioning || slides.length <= 1) return;

		const newIndex = clampIndex(index);
		if (newIndex === currentIndex && !cardMode) return;

		isTransitioning = true;
		const moveDirection = direction || (newIndex > currentIndex ? 'left' : 'right');

		if (cardMode) {
			animateCardSlide(newIndex, moveDirection);
		} else {
			animateStandardSlide(newIndex, moveDirection);
		}
	}

	function animateStandardSlide(newIndex: number, direction: 'left' | 'right'): void {
		if (tl) tl.kill();
		tl = gsap.timeline({
			onComplete: () => {
				currentIndex = newIndex;
				isTransitioning = false;
				resetAutoplay();
			}
		});

		const currentSlide = slideElements[currentIndex];
		const nextSlide = slideElements[newIndex];

		if (!currentSlide || !nextSlide) {
			currentIndex = newIndex;
			isTransitioning = false;
			return;
		}

		const slideWidth = currentSlide.offsetWidth;
		const depthOffset = depthEffect ? (1 - depthScale) * 100 : 0;

		tl.set(nextSlide, {
			x: direction === 'left' ? slideWidth : -slideWidth,
			scale: depthEffect ? depthScale : 1,
			zIndex: 1,
			opacity: depthEffect ? 0.7 : 1
		});

		tl.set(currentSlide, {
			zIndex: 2,
			scale: 1
		});

		tl.to(currentSlide, {
			x: direction === 'left' ? -slideWidth : slideWidth,
			duration: 0.6,
			ease: 'power2.inOut',
			opacity: depthEffect ? 0.5 : 1,
			scale: depthEffect ? depthScale : 1
		}, 0);

		tl.to(nextSlide, {
			x: 0,
			duration: 0.6,
			ease: 'power2.inOut',
			opacity: 1,
			scale: 1
		}, 0);

		if (depthEffect) {
			tl.to(currentSlide, {
				filter: 'blur(2px)',
				duration: 0.6,
				ease: 'power2.inOut'
			}, 0);

			tl.set(nextSlide, {
				filter: 'blur(2px)'
			});

			tl.to(nextSlide, {
				filter: 'blur(0px)',
				duration: 0.6,
				ease: 'power2.inOut'
			}, 0);
		}
	}

	function animateCardSlide(newIndex: number, direction: 'left' | 'right'): void {
		if (tl) tl.kill();
		tl = gsap.timeline({
			onComplete: () => {
				currentIndex = newIndex;
				isTransitioning = false;
				resetAutoplay();
			}
		});

		const visibleCount = Math.min(cardVisibleCount, totalSlides);
		const slideWidth = slideElements[0]?.offsetWidth || 300;
		const gap = 20;
		const totalWidth = slideWidth + gap;

		slideElements.forEach((slide, i) => {
			const effectiveI = ((i % totalSlides) + totalSlides) % totalSlides;
			const distanceFromCurrent = getCardDistance(effectiveI, currentIndex);

			let xPosition = 0;
			let scale = 1;
			let opacity = 1;
			let zIndex = 0;

			if (distanceFromCurrent >= 0 && distanceFromCurrent < visibleCount) {
				const progress = distanceFromCurrent / (visibleCount - 1);
				xPosition = (distanceFromCurrent * totalWidth);
				scale = depthEffect ? 1 - (progress * (1 - depthScale)) : 1;
				opacity = depthEffect ? 1 - (progress * 0.3) : 1;
				zIndex = visibleCount - distanceFromCurrent;
			} else if (loop) {
				const wrappedDistance = getWrappedDistance(effectiveI, currentIndex, totalSlides);
				if (wrappedDistance < visibleCount) {
					const progress = wrappedDistance / (visibleCount - 1);
					xPosition = (wrappedDistance * totalWidth);
					scale = depthEffect ? 1 - (progress * (1 - depthScale)) : 1;
					opacity = depthEffect ? 1 - (progress * 0.3) : 1;
					zIndex = visibleCount - wrappedDistance;
				} else {
					xPosition = direction === 'left' ? -totalWidth : (visibleCount + 1) * totalWidth;
					opacity = 0;
					scale = depthScale;
				}
			} else {
				xPosition = direction === 'left' ? -totalWidth : visibleCount * totalWidth;
				opacity = 0;
				scale = depthScale;
			}

			tl.set(slide, {
				x: xPosition,
				scale,
				opacity,
				zIndex,
				filter: depthEffect && distanceFromCurrent > 0 ? `blur(${distanceFromCurrent}px)` : 'blur(0px)'
			});
		});

		slideElements.forEach((slide, i) => {
			const effectiveI = ((i % totalSlides) + totalSlides) % totalSlides;
			const oldDistance = getCardDistance(effectiveI, currentIndex);
			const newDistance = getCardDistance(effectiveI, newIndex);

			let newX = 0;
			let newScale = 1;
			let newOpacity = 1;
			let newZIndex = 0;

			if (newDistance >= 0 && newDistance < visibleCount) {
				const progress = newDistance / (visibleCount - 1);
				newX = (newDistance * totalWidth);
				newScale = depthEffect ? 1 - (progress * (1 - depthScale)) : 1;
				newOpacity = depthEffect ? 1 - (progress * 0.3) : 1;
				newZIndex = visibleCount - newDistance;
			} else {
				newX = direction === 'left' ? -totalWidth : visibleCount * totalWidth;
				newOpacity = 0;
				newScale = depthScale;
				newZIndex = 0;
			}

			tl.to(slide, {
				x: newX,
				scale: newScale,
				opacity: newOpacity,
				zIndex: newZIndex,
				filter: depthEffect && newDistance > 0 ? `blur(${Math.min(newDistance, 3)}px)` : 'blur(0px)',
				duration: 0.5,
				ease: 'power2.inOut'
			}, 0);
		});
	}

	function getCardDistance(cardIndex: number, currentCenter: number): number {
		return cardIndex - currentCenter;
	}

	function getWrappedDistance(cardIndex: number, currentCenter: number, total: number): number {
		const direct = Math.abs(cardIndex - currentCenter);
		const wrapped = total - direct;
		return Math.min(direct, wrapped);
	}

	function next(): void {
		goToSlide(currentIndex + 1, 'left');
	}

	function prev(): void {
		goToSlide(currentIndex - 1, 'right');
	}

	function startAutoplay(): void {
		if (!autoplay || isPaused) return;
		stopAutoplay();
		autoplayTimer = setInterval(() => {
			if (!isTransitioning) {
				next();
			}
		}, autoplayInterval);
	}

	function stopAutoplay(): void {
		if (autoplayTimer) {
			clearInterval(autoplayTimer);
			autoplayTimer = null;
		}
	}

	function resetAutoplay(): void {
		stopAutoplay();
		if (autoplay && !isPaused) {
			startAutoplay();
		}
	}

	function startAutoscroll(): void {
		if (!autoscroll || cardMode) return;

		if (autoscrollTween) autoscrollTween.kill();

		const slideWidth = slideElements[0]?.offsetWidth || 300;
		const duration = (slideWidth / 50) * (1 / autoscrollSpeed);

		autoscrollTween = gsap.to(track, {
			x: `-${slideWidth * totalSlides}`,
			duration: duration * totalSlides,
			ease: 'none',
			repeat: loop ? -1 : 0,
			onRepeat: () => {
				gsap.set(track, { x: 0 });
			}
		});
	}

	function stopAutoscroll(): void {
		if (autoscrollTween) {
			autoscrollTween.kill();
			autoscrollTween = null;
		}
	}

	function handleMouseEnter(): void {
		isPaused = true;
		stopAutoplay();
	}

	function handleMouseLeave(): void {
		isPaused = false;
		startAutoplay();
	}

	function initializeSlides(): void {
		if (tl) tl.kill();
		stopAutoscroll();

		gsap.set(track, { x: 0 });

		if (cardMode) {
			initializeCardMode();
		} else {
			initializeStandardMode();
		}

		if (autoscroll && !cardMode) {
			startAutoscroll();
		}

		if (autoplay) {
			startAutoplay();
		}
	}

	function initializeStandardMode(): void {
		slideElements.forEach((slide, i) => {
			const isActive = i === currentIndex;
			gsap.set(slide, {
				x: isActive ? 0 : (i > currentIndex ? slide.offsetWidth : -slide.offsetWidth),
				scale: depthEffect && !isActive ? depthScale : 1,
				opacity: isActive ? 1 : (depthEffect ? 0.7 : 0),
				zIndex: isActive ? 2 : 1,
				filter: depthEffect && !isActive ? 'blur(2px)' : 'blur(0px)'
			});
		});
	}

	function initializeCardMode(): void {
		const visibleCount = Math.min(cardVisibleCount, totalSlides);
		const slideWidth = slideElements[0]?.offsetWidth || 300;
		const gap = 20;
		const totalWidth = slideWidth + gap;

		slideElements.forEach((slide, i) => {
			const effectiveI = ((i % totalSlides) + totalSlides) % totalSlides;
			const distance = getCardDistance(effectiveI, currentIndex);

			let xPosition = 0;
			let scale = 1;
			let opacity = 1;
			let zIndex = 0;

			if (distance >= 0 && distance < visibleCount) {
				const progress = distance / (visibleCount - 1);
				xPosition = (distance * totalWidth);
				scale = depthEffect ? 1 - (progress * (1 - depthScale)) : 1;
				opacity = depthEffect ? 1 - (progress * 0.3) : 1;
				zIndex = visibleCount - distance;
			} else {
				xPosition = visibleCount * totalWidth;
				opacity = 0;
				scale = depthScale;
			}

			gsap.set(slide, {
				x: xPosition,
				scale,
				opacity,
				zIndex,
				filter: depthEffect && distance > 0 ? `blur(${Math.min(distance, 3)}px)` : 'blur(0px)'
			});
		});
	}

	onMount(() => {
		tick().then(() => {
			initializeSlides();
		});
	});

	$effect(() => {
		slides;
		tick().then(() => {
			initializeSlides();
		});
	});

	$effect(() => {
		autoplay;
		if (autoplay) {
			startAutoplay();
		} else {
			stopAutoplay();
		}
	});

	$effect(() => {
		autoscroll;
		if (autoscroll && !cardMode) {
			startAutoscroll();
		} else {
			stopAutoscroll();
		}
	});

	onDestroy(() => {
		stopAutoplay();
		stopAutoscroll();
		if (tl) tl.kill();
	});
</script>

<div
	bind:this={container}
	class="carousel-container {className}"
	class:card-mode={cardMode}
	class:depth-effect={depthEffect}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
>
	<div class="carousel-track-wrapper">
		<div
			bind:this={track}
			class="carousel-track"
			class:card-mode={cardMode}
		>
			{#each slides as slide, index (slide.id ?? index)}
				<div
					bind:this={slideElements[index]}
					class="carousel-slide"
					class:active={index === effectiveIndex}
					class:card-mode={cardMode}
				>
					<slot name="slide" {slide} {index} {isActive: index === effectiveIndex} />
				</div>
			{/each}
		</div>
	</div>

	{#if showNavigation && totalSlides > 1}
		<button
			class="nav-button nav-prev"
			onclick={prev}
			disabled={isTransitioning || (!loop && effectiveIndex === 0)}
			aria-label="Previous slide"
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>
	{/if}

	{#if showNavigation && totalSlides > 1}
		<button
			class="nav-button nav-next"
			onclick={next}
			disabled={isTransitioning || (!loop && effectiveIndex === totalSlides - 1)}
			aria-label="Next slide"
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>
	{/if}

	{#if showPagination && totalSlides > 1}
		<div class="pagination">
			{#each slides as _, index}
				<button
					class="pagination-dot"
					class:active={index === effectiveIndex}
					onclick={() => goToSlide(index)}
					aria-label="Go to slide {index + 1}"
				>
				</button>
			{/each}
		</div>
	{/if}

	{#if (autoplay || autoscroll) && totalSlides > 1}
		<button
			class="pause-button"
			onclick={() => {
				isPaused = !isPaused;
				if (isPaused) {
					stopAutoplay();
					stopAutoscroll();
				} else {
					startAutoplay();
					if (autoscroll && !cardMode) startAutoscroll();
				}
			}}
			aria-label={isPaused ? 'Resume' : 'Pause'}
		>
			{#if isPaused}
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M6 4L16 10L6 16V4Z" fill="currentColor"/>
				</svg>
			{:else}
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="5" y="4" width="3" height="12" fill="currentColor"/>
					<rect x="12" y="4" width="3" height="12" fill="currentColor"/>
				</svg>
			{/if}
		</button>
	{/if}
</div>

<style lang="scss">
	.carousel-container {
		position: relative;
		width: 100%;
		max-width: 100%;
		overflow: hidden;
		margin: 0 auto;

		&.depth-effect {
			.carousel-track-wrapper {
				perspective: 1000px;
			}
		}

		&.card-mode {
			.carousel-track {
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.carousel-slide.card-mode {
				position: absolute;
				width: calc(100% / 3);
				max-width: 400px;
				transition: transform 0.3s ease;

				&:hover {
					transform: translateY(-10px) scale(1.02);
				}
			}
		}
	}

	.carousel-track-wrapper {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: relative;
	}

	.carousel-track {
		position: relative;
		width: 100%;
		height: 100%;

		&.card-mode {
			min-height: 400px;
		}
	}

	.carousel-slide {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		&.active {
			z-index: 10;
		}

		&.card-mode {
			border-radius: 12px;
			overflow: hidden;
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		}
	}

	.nav-button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 20;
		background: rgba(255, 255, 255, 0.9);
		border: none;
		border-radius: 50%;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		color: #333;

		&:hover:not(:disabled) {
			background: rgba(255, 255, 255, 1);
			transform: translateY(-50%) scale(1.1);
			box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
		}

		&:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}

		&.nav-prev {
			left: 16px;
		}

		&.nav-next {
			right: 16px;
		}
	}

	.pagination {
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 10px;
		z-index: 20;
	}

	.pagination-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.8);
		background: transparent;
		cursor: pointer;
		transition: all 0.3s ease;
		padding: 0;

		&:hover {
			background: rgba(255, 255, 255, 0.5);
			transform: scale(1.2);
		}

		&.active {
			background: rgba(255, 255, 255, 1);
			transform: scale(1.3);
			box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
		}
	}

	.pause-button {
		position: absolute;
		bottom: 20px;
		right: 20px;
		z-index: 20;
		background: rgba(255, 255, 255, 0.8);
		border: none;
		border-radius: 50%;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
		color: #333;

		&:hover {
			background: rgba(255, 255, 255, 1);
			transform: scale(1.1);
		}
	}

	@media (max-width: 768px) {
		.nav-button {
			width: 40px;
			height: 40px;

			&.nav-prev {
				left: 8px;
			}

			&.nav-next {
				right: 8px;
			}
		}

		.carousel-slide.card-mode {
			width: calc(100% / 2);
		}
	}
</style>
