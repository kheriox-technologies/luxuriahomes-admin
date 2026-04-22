import { SignIn } from '@clerk/nextjs';

const Page = () => {
	return (
		<SignIn
			appearance={{
				elements: {
					logoBox: '!h-16',
					logoImage: '!h-16 !w-auto',
				},
			}}
		/>
	);
};

export default Page;
