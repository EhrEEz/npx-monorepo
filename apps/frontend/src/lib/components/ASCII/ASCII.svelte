<script lang="ts">
	import { ASCII_CONTENT as ascii } from './ascii';
	import { initASCIIAnimations, destroyASCIIAnimation } from './ascii_animations';
	let asciiText = $state<HTMLElement>();
	$effect(() => {
		if (asciiText) {
			initASCIIAnimations(asciiText);
		} else {
			console.error("ASCII Error: AsciiText element wasn't bound");
		}

		return () => {
			destroyASCIIAnimation();
		};
	});
</script>

<div class="ascii__card">
	<!-- eslint-disable-next-line  -->
	<div class="ascii__art" bind:this={asciiText}>{@html ascii}</div>
</div>
