<script lang="ts">
	import { ASCII_CONTENT as ascii } from './ascii';
	import { initAsciiTimeline } from '$lib/components/ASCII/logo';
	import { destroyASCIIAnimation } from './ascii_animations';
	let asciiSection = $state<HTMLElement>();
	let asciiText = $state<HTMLElement>();
	let asciiCard = $state<HTMLElement>();
	$effect(() => {
		if (asciiSection && asciiText && asciiCard) {
			initAsciiTimeline(asciiSection, asciiText, asciiCard);
		} else {
			console.error("ASCII Error: AsciiText element wasn't bound");
		}

		return () => {
			destroyASCIIAnimation();
		};
	});
</script>

<section
	class="ascii__section full-width content-grid"
	data-section="dark"
	aria-hidden="true"
	aria-label="Nepaxis ASCII Logo Section"
	bind:this={asciiSection}
>
	<div class="ascii__card" bind:this={asciiCard}>
		<!-- eslint-disable-next-line  -->
		<div class="ascii__art" bind:this={asciiText}>{@html ascii}</div>
	</div>
</section>
