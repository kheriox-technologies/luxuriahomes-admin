'use client';

import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
import { Input } from '@workspace/ui/components/input';
import { Switch } from '@workspace/ui/components/switch';
import { Textarea } from '@workspace/ui/components/textarea';
import {
	formatFieldErrors,
	WEBSITE_PROJECT_SPECS,
	type WebsiteProjectFormApi,
	type WebsiteProjectStatus,
	WebsiteProjectStatusCombobox,
} from './website-project-form-shared';

/** Parses a numeric input value to a number or undefined when empty. */
function parseNumber(value: string): number | undefined {
	return value === '' ? undefined : Number(value);
}

export function WebsiteProjectFormFields({
	form,
}: {
	form: WebsiteProjectFormApi;
}) {
	return (
		<>
			<Frame>
				<FrameHeader className="flex flex-row items-center py-3">
					<FrameTitle className="min-w-0 truncate leading-none">
						Project details
					</FrameTitle>
				</FrameHeader>
				<FramePanel className="space-y-4">
					<form.Field name="name">
						{(field) => {
							const invalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={invalid}>
									<FieldLabel htmlFor={field.name}>Name</FieldLabel>
									<Input
										aria-invalid={invalid}
										id={field.name}
										name={field.name}
										nativeInput
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Project name"
										value={field.state.value ?? ''}
									/>
									{invalid ? (
										<FieldError>
											{formatFieldErrors(field.state.meta.errors)}
										</FieldError>
									) : null}
								</Field>
							);
						}}
					</form.Field>

					<form.Field name="description">
						{(field) => (
							<Field>
								<FieldLabel htmlFor={field.name}>
									Description
									<span className="ml-1 text-muted-foreground text-xs">
										(optional)
									</span>
								</FieldLabel>
								<Textarea
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Brief description shown on the website"
									rows={4}
									value={field.state.value ?? ''}
								/>
							</Field>
						)}
					</form.Field>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<form.Field name="status">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Status</FieldLabel>
										<WebsiteProjectStatusCombobox
											id={field.name}
											invalid={invalid}
											onBlur={field.handleBlur}
											onChange={(next) =>
												field.handleChange(next as WebsiteProjectStatus)
											}
											placeholder="Select status"
											value={field.state.value as WebsiteProjectStatus | ''}
										/>
										{invalid ? (
											<FieldError>
												{formatFieldErrors(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="completedYear">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>
											Year
											<span className="ml-1 text-muted-foreground text-xs">
												(optional)
											</span>
										</FieldLabel>
										<Input
											aria-invalid={invalid}
											id={field.name}
											inputMode="numeric"
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(parseNumber(e.target.value))
											}
											placeholder="2025"
											type="number"
											value={field.state.value ?? ''}
										/>
										{invalid ? (
											<FieldError>
												{formatFieldErrors(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>
					</div>
				</FramePanel>
			</Frame>

			<Frame>
				<FrameHeader className="flex flex-row items-center py-3">
					<FrameTitle className="min-w-0 truncate leading-none">
						Specifications
						<span className="ml-1 font-normal text-muted-foreground text-xs">
							(optional)
						</span>
					</FrameTitle>
				</FrameHeader>
				<FramePanel className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{WEBSITE_PROJECT_SPECS.map((spec) => (
						<form.Field key={spec.key} name={spec.key}>
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>
											{spec.label}
											{spec.unit ? (
												<span className="ml-1 text-muted-foreground text-xs">
													({spec.unit})
												</span>
											) : null}
										</FieldLabel>
										<Input
											aria-invalid={invalid}
											id={field.name}
											inputMode="decimal"
											min={0}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(parseNumber(e.target.value))
											}
											placeholder="0"
											step="any"
											type="number"
											value={field.state.value ?? ''}
										/>
										{invalid ? (
											<FieldError>
												{formatFieldErrors(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>
					))}
				</FramePanel>
			</Frame>

			<Frame>
				<FramePanel className="space-y-4 py-4">
					<form.Field name="hasPool">
						{(field) => (
							<Field className="flex flex-row items-center justify-between gap-4">
								<div className="space-y-1">
									<FieldLabel htmlFor={field.name}>Pool</FieldLabel>
									<p className="text-muted-foreground text-xs">
										Whether this project includes a swimming pool.
									</p>
								</div>
								<Switch
									checked={Boolean(field.state.value)}
									id={field.name}
									onCheckedChange={(checked) => field.handleChange(checked)}
								/>
							</Field>
						)}
					</form.Field>

					<form.Field name="include">
						{(field) => (
							<Field className="flex flex-row items-center justify-between gap-4">
								<div className="space-y-1">
									<FieldLabel htmlFor={field.name}>Show on website</FieldLabel>
									<p className="text-muted-foreground text-xs">
										When off, this project is hidden from the public website.
									</p>
								</div>
								<Switch
									checked={Boolean(field.state.value)}
									id={field.name}
									onCheckedChange={(checked) => field.handleChange(checked)}
								/>
							</Field>
						)}
					</form.Field>
				</FramePanel>
			</Frame>
		</>
	);
}
