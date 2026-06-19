export const CenteredLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex h-screen items-center justify-center bg-[#1F1F23]">
			{children}
		</div>
	);
};
