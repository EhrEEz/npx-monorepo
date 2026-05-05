import type { Media } from '$backend/src/payload-types';

class Preview {
	#open = $state<boolean>(false);
	image = $state<Media | null>(null);
	alt = $state<string>('');

	openPreview(image: Media, alt: string) {
		this.image = image;
		this.alt = alt;
		console.log('triggered openPreview');
		this.#open = true;
	}
	closePreview() {
		this.#open = false;
		console.log('triggered closePreview');
	}

	get open() {
		return this.#open;
	}
}

export const preview = new Preview();
