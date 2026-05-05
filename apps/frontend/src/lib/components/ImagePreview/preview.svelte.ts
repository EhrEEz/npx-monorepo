import type { Media } from '$backend/src/payload-types';
export const preview = $state<{ open: boolean; image: Media | null; alt?: string }>({
	open: false,
	image: null,
	alt: ''
});

export function openPreview(image: Media, alt: string) {
	preview.image = image;
	preview.alt = alt;
}

export function closePreview() {
	preview.open = false;
}
