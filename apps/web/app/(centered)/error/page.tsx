'use client';
import { useAuth, useClerk } from '@clerk/nextjs';
import { AlertTriangle, CircleX, LoaderIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { DEFAULT_ERROR, ERROR_CODES, type ErrorCode } from '@/lib/error-codes';

const ErrorContent = () => {
	const searchParams = useSearchParams();
	const errorCode = searchParams.get('error') as ErrorCode | null;

	// Get error details or use default
	const errorDetails =
		errorCode && ERROR_CODES[errorCode]
			? ERROR_CODES[errorCode]
			: DEFAULT_ERROR;

	// Determine icon and color based on error level
	const isWarning = errorDetails.level === 'warning';
	const IconComponent = isWarning ? AlertTriangle : CircleX;
	const iconColor = isWarning ? 'text-yellow-500' : 'text-red-500';

	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<IconComponent className={`size-8 ${iconColor}`} />
			<h1 className="text-xl">{errorDetails.title}</h1>
			<p className="text-center text-gray-500 text-sm">
				{errorDetails.message}
			</p>
		</div>
	);
};

const ErrorPage = () => {
	const { isSignedIn } = useAuth();
	const { signOut } = useClerk();

	return (
		<div className="flex w-full justify-center p-4 md:p-0">
			<Card className="w-full md:max-w-lg">
				<CardContent>
					<Suspense
						fallback={
							<div className="flex justify-center py-4">
								<LoaderIcon className="animate-spin" />
							</div>
						}
					>
						<ErrorContent />
					</Suspense>
				</CardContent>
				<CardFooter>
					<div className="flex w-full justify-center gap-2">
						<Link href="/">
							<Button>Go Home</Button>
						</Link>
						{isSignedIn && (
							<Button
								onClick={() => signOut({ redirectUrl: '/' })}
								variant="outline"
							>
								Log out
							</Button>
						)}
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};

export default ErrorPage;
