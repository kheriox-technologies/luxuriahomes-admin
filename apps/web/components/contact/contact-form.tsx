'use client';

import { api } from '@workspace/backend/api';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { toastManager } from '@workspace/ui/components/toast';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation } from 'convex/react';
import { ConvexError } from 'convex/values';
import { Send } from 'lucide-react';
import { type FormEvent, useState } from 'react';

interface Fields {
	email: string;
	firstName: string;
	lastName: string;
	message: string;
	phone: string;
}

const EMPTY: Fields = {
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
	message: '',
};

const textareaClass =
	'min-h-32 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base text-foreground shadow-xs/5 outline-none ring-ring/24 transition-shadow placeholder:text-muted-foreground/72 focus-visible:border-ring focus-visible:ring-[3px] sm:text-sm';

export function ContactForm() {
	const submitEnquiry = useMutation(api.web.leads.submitEnquiry);
	const [fields, setFields] = useState<Fields>(EMPTY);
	const [submitting, setSubmitting] = useState(false);

	const update =
		(key: keyof Fields) => (event: { target: { value: string } }) =>
			setFields((prev) => ({ ...prev, [key]: event.target.value }));

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSubmitting(true);
		try {
			await submitEnquiry({
				firstName: fields.firstName,
				lastName: fields.lastName,
				email: fields.email,
				phone: fields.phone || undefined,
				message: fields.message,
			});
			toastManager.add({
				title: 'Enquiry sent',
				description:
					'Thanks for reaching out — our team will be in touch soon.',
				type: 'success',
			});
			setFields(EMPTY);
		} catch (error) {
			const message =
				error instanceof ConvexError
					? String((error.data as { message?: string })?.message ?? '')
					: '';
			toastManager.add({
				title: 'Could not send enquiry',
				description:
					message || 'Something went wrong. Please try again or call us.',
				type: 'error',
			});
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form className="flex flex-col gap-5" noValidate onSubmit={onSubmit}>
			<div className="grid gap-5 sm:grid-cols-2">
				<div className="flex flex-col gap-2">
					<Label htmlFor="firstName">
						First name <span className="text-brand-accent">*</span>
					</Label>
					<Input
						autoComplete="given-name"
						id="firstName"
						onChange={update('firstName')}
						required
						value={fields.firstName}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="lastName">
						Last name <span className="text-brand-accent">*</span>
					</Label>
					<Input
						autoComplete="family-name"
						id="lastName"
						onChange={update('lastName')}
						required
						value={fields.lastName}
					/>
				</div>
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				<div className="flex flex-col gap-2">
					<Label htmlFor="email">
						Email <span className="text-brand-accent">*</span>
					</Label>
					<Input
						autoComplete="email"
						id="email"
						onChange={update('email')}
						required
						type="email"
						value={fields.email}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="phone">Phone</Label>
					<Input
						autoComplete="tel"
						id="phone"
						onChange={update('phone')}
						type="tel"
						value={fields.phone}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="message">
					Message <span className="text-brand-accent">*</span>
				</Label>
				<textarea
					className={cn(textareaClass)}
					id="message"
					onChange={update('message')}
					placeholder="Tell us about your project — block, budget, timeline…"
					required
					value={fields.message}
				/>
			</div>

			<Button
				className="self-start"
				loading={submitting}
				size="xl"
				type="submit"
			>
				Send Enquiry
				<Send />
			</Button>
		</form>
	);
}
