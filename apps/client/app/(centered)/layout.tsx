import { CenteredLayout } from '@/layouts/centered-layout';

type LayoutProps = Readonly<{
	children: React.ReactNode;
}>;

const Layout = ({ children }: LayoutProps) => {
	return <CenteredLayout>{children}</CenteredLayout>;
};

export default Layout;
