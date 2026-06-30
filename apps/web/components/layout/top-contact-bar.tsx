import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { CONTACT, PHONES, telHref } from '@/lib/contact';

/** Slim utility bar above the navbar with contact details and licence. */
export function TopContactBar() {
	return (
		<div className="hidden border-white/10 border-b bg-brand-navy-soft text-brand-cream/90 lg:block">
			<div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-6 px-6 text-xs">
				<div className="flex items-center gap-6">
					<a
						className="flex items-center gap-2 transition-colors hover:text-brand-cream"
						href={`mailto:${CONTACT.email}`}
					>
						<Mail className="size-3.5 opacity-80" />
						{CONTACT.email}
					</a>
					<span className="flex items-center gap-2">
						<MapPin className="size-3.5 opacity-80" />
						{CONTACT.address}
					</span>
				</div>
				<div className="flex items-center gap-6">
					{CONTACT.qbccLicence ? (
						<span className="flex items-center gap-2">
							<ShieldCheck className="size-3.5 opacity-80" />
							QBCC Licence {CONTACT.qbccLicence}
						</span>
					) : null}
					<div className="flex items-center gap-3">
						<Phone className="size-3.5 opacity-80" />
						{PHONES.map((phone, index) => (
							<span className="flex items-center gap-3" key={phone}>
								{index > 0 ? (
									<span className="text-brand-cream/30">·</span>
								) : null}
								<a
									className="transition-colors hover:text-brand-cream"
									href={telHref(phone)}
								>
									{phone}
								</a>
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
