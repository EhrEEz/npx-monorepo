<script lang="ts">
	import '$lib/scss/styles.scss';
</script>

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17943724166"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());
		gtag('config', 'AW-17943724166');
	</script>
	<script>
		gtag('event', 'conversion', {
			send_to: 'AW-17943724166/5OJlCOXZ9vUbEIaBnuxC'
		});
	</script>
</svelte:head>

<section class="content-grid pt-7">
	<div class="grid-row">
		<div class="col-md-8">
			<h1 class="heading-2 my-3">Nepaxis</h1>
			<div class="my-4">
				<h2 class="heading-5 mb-3">Who we are</h2>
				<div class="mb-2">
					<a class="link" href="/">Go Home</a>
				</div>

				<p class="neutral-300" style="max-width:50ch;">
					Nepaxis Technologies is a UAE-registered technology company built on a simple but powerful
					conviction: that world-class engineering should be accessible, accountable, and built to
					last.
				</p>
			</div>
		</div>
	</div>
</section>

<section class="content-grid">
	<img
		src="/images/nepaxis-intro.png"
		style="max-width:100%"
		alt="Nepaxis Services with Mobile Development, Web Design and Development"
	/>
	<div class="fl-row jc-center al-center my-6">
		<a class="btn btn--primary" href="/contact"
			><span class="btn__wrapper"><span class="btn__text">Contact Us</span></span></a
		>
	</div>
</section>
