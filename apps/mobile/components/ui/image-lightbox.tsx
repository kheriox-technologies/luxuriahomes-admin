import { Image } from 'expo-image';
import { X } from 'lucide-react-native';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Full-screen image viewer. Tapping the dark backdrop or the close button
 * dismisses it. Reused for inclusion thumbnails and note images.
 */
export function ImageLightbox({
	uri,
	visible,
	onClose,
	title,
}: {
	uri: string | null;
	visible: boolean;
	onClose: () => void;
	title?: string;
}) {
	const insets = useSafeAreaInsets();

	return (
		<Modal
			animationType="fade"
			onRequestClose={onClose}
			presentationStyle="overFullScreen"
			transparent
			visible={visible}
		>
			<Pressable
				accessibilityLabel="Close image"
				className="flex-1 items-center justify-center bg-black/80 px-4"
				onPress={onClose}
			>
				{uri ? (
					<Image
						cachePolicy="memory-disk"
						contentFit="contain"
						source={{ uri }}
						style={{ width: '100%', height: '80%' }}
					/>
				) : null}
			</Pressable>
			<View
				className="absolute right-0 left-0 flex-row items-center justify-between px-4"
				style={{ top: insets.top + 8 }}
			>
				{title ? (
					<Text
						className="flex-1 font-sans-medium text-base text-white"
						numberOfLines={1}
					>
						{title}
					</Text>
				) : (
					<View className="flex-1" />
				)}
				<Pressable
					accessibilityLabel="Close"
					accessibilityRole="button"
					className="h-10 w-10 items-center justify-center rounded-full bg-white/15 active:bg-white/25"
					hitSlop={8}
					onPress={onClose}
				>
					<X color="#ffffff" size={22} strokeWidth={2} />
				</Pressable>
			</View>
		</Modal>
	);
}
