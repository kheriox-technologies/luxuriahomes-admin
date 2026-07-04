import { api } from '@workspace/backend/api';
import { useMutation } from 'convex/react';
import type { LucideIcon } from 'lucide-react-native';
import { CheckCheck, CircleDashed, Download, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/format';
import { useInclusionActions } from './inclusion-actions-provider';
import type { InclusionSection } from './types';

const MINUS_SIGN = '−';

function signedVariation(total: number): string {
	if (total === 0) {
		return formatCurrency(0);
	}
	const sign = total > 0 ? '+' : MINUS_SIGN;
	return `${sign}${formatCurrency(Math.abs(total))}`;
}

function HeaderIconButton({
	icon: Icon,
	label,
	busy,
	onPress,
}: {
	icon: LucideIcon;
	label: string;
	busy: boolean;
	onPress: () => void;
}) {
	const colors = useThemeColors();
	return (
		<Pressable
			accessibilityLabel={label}
			accessibilityRole="button"
			className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
			disabled={busy}
			hitSlop={4}
			onPress={onPress}
		>
			{busy ? (
				<ActivityIndicator color={colors.mutedForeground} size="small" />
			) : (
				<Icon color={colors.foreground} size={18} strokeWidth={2} />
			)}
		</Pressable>
	);
}

export function InclusionSectionHeader({
	section,
}: {
	section: InclusionSection;
}) {
	const { downloadPdf, emailPdf } = useInclusionActions();
	const update = useMutation(api.projectInclusions.update.update);
	const [downloading, setDownloading] = useState(false);
	const [emailing, setEmailing] = useState(false);
	const [approving, setApproving] = useState(false);

	const trigger = { sectionKey: section.key, title: section.title };

	const handleDownload = async () => {
		setDownloading(true);
		await downloadPdf(trigger);
		setDownloading(false);
	};

	const handleEmail = async () => {
		setEmailing(true);
		await emailPdf(trigger);
		setEmailing(false);
	};

	const allApproved =
		section.data.length > 0 &&
		section.data.every((i) => i.status === 'Approved');
	const targetStatus = allApproved ? 'Under Review' : 'Approved';
	const toChange = section.data.filter((i) => i.status !== targetStatus);

	const runBulkStatus = async () => {
		setApproving(true);
		try {
			await Promise.all(
				toChange.map((i) =>
					update({ projectInclusionId: i._id, status: targetStatus })
				)
			);
		} catch {
			Alert.alert('Unable to update', 'Some inclusions could not be updated.');
		} finally {
			setApproving(false);
		}
	};

	const handleToggleAll = () => {
		if (section.data.length === 0) {
			return;
		}
		const verb = allApproved ? 'Unapprove' : 'Approve';
		const count = toChange.length;
		Alert.alert(
			`${verb} all`,
			`${verb} ${count} inclusion${count === 1 ? '' : 's'} in ${section.title}?`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: verb, onPress: runBulkStatus },
			]
		);
	};

	return (
		<View className="flex-row items-center gap-1.5 bg-background px-4 pt-5 pb-2">
			<View className="flex-1 flex-row flex-wrap items-center gap-x-2 gap-y-1">
				<Text className="font-sans-semibold text-muted-foreground text-xs uppercase tracking-wider">
					{section.title} · {section.data.length}
				</Text>
				{section.variationTotal !== 0 ? (
					<Badge variant="purple">
						{signedVariation(section.variationTotal)}
					</Badge>
				) : null}
			</View>
			<HeaderIconButton
				busy={downloading}
				icon={Download}
				label={`Download ${section.title} PDF`}
				onPress={handleDownload}
			/>
			<HeaderIconButton
				busy={emailing}
				icon={Mail}
				label={`Email ${section.title} PDF`}
				onPress={handleEmail}
			/>
			<HeaderIconButton
				busy={approving}
				icon={allApproved ? CircleDashed : CheckCheck}
				label={`${allApproved ? 'Unapprove' : 'Approve'} all in ${section.title}`}
				onPress={handleToggleAll}
			/>
		</View>
	);
}
