<script lang="ts">
	import { Logo } from '$lib/components/Logo';
	import { resolve } from '$app/paths';
	const CURRENT_YEAR = new Date().getFullYear();
	const { children } = $props();
</script>

<header class="content-grid py-2 py-md-3">
	<nav class="fl-row jc-between al-center">
		<h1 class="relative">
			<a href="/" class="nav__logo">
				<Logo fill="currentColor" />
				<span class="sr-only">Nepaxis</span>
			</a>
		</h1>
		<button class="menu__btn btn--white btn--narrow btn--primary">
			<span class="btn__wrapper">
				<span class="btn__text">Get Free Quote</span>
			</span>
		</button>
	</nav>
</header>

<main class="content-grid">
	{@render children()}
</main>
<footer class="end__footer py-2 py-md-3">
	<div class="legal regular-12 font-mono uppercase tracking-wide text-center neutral-400 py-lg-2">
		Nepaxis Technologies © <span id="currentYear">{CURRENT_YEAR}</span> |
		<a class="link light" href={resolve('/privacy-policy')}>Privacy Policy</a>
		& <a class="link light" href={resolve('/terms-of-service')}>Terms of Service</a>
	</div>
</footer>

<style>
	.end__footer {
		border-block-start: 1px solid var(--clr-neutral-600);
	}
</style>
