// contact.form.svelte.ts
import type { Validation, ValidationFunction } from './contact.types';

export class FormControl {
	value: string = $state('');
	error: boolean = $state(false);
	errorMessage: string = $state('');
	changed: boolean = $state(false);
	private validationFunction: ValidationFunction = () => true;

	constructor(config?: { value?: string; validate?: ValidationFunction }) {
		if (config?.value) this.value = config.value;
		if (config?.validate) this.validationFunction = config.validate;
	}

	validate() {
		const result = this.validationFunction(this.value);
		if (typeof result === 'string') {
			this.error = true;
			this.errorMessage = result;
		} else {
			this.error = false;
			this.errorMessage = '';
		}
		this.changed = true;
	}

	reset() {
		this.value = '';
		this.error = false;
		this.errorMessage = '';
		this.changed = false;
	}
}

export function validateFullName(value: string): Validation {
	return value.trim().length > 0 ? true : 'Full Name is required';
}

export function validateCompanyName(value: string): Validation {
	const trimmed = value.trim();
	return !trimmed || trimmed.length >= 2 ? true : 'Company Name must be at least 2 characters';
}

export function validateEmail(value: string): Validation {
	if (!value.trim()) return 'Email is required';
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? true : 'Enter a valid email';
}

export function validatePhoneNumber(value: string): Validation {
	const trimmed = value.trim();
	if (!trimmed) return true;
	return /^[0-9+\-\s()]{7,}$/.test(trimmed) ? true : 'Enter a valid phone number.';
}

export function validateMessage(value: string): Validation {
	const trimmed = value.trim();
	if (!trimmed) return true;
	if (trimmed.length < 5) return 'Message must be at least 5 characters.';
	if (trimmed.length > 500) return 'Message must be at most 500 characters.';
	return true;
}
