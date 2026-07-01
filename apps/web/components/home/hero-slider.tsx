'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { staticCdnUrl } from '@/lib/static-cdn';

const SLIDE_INTERVAL_MS = 6000;

interface HeroSliderProps {
	imageKeys: string[];
}

export function HeroSlider({ imageKeys }: HeroSliderProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const slideCount = imageKeys.length;

	const goTo = useCallback(
		(index: number) => {
			setActiveIndex((index + slideCount) % slideCount);
		},
		[slideCount]
	);

	useEffect(() => {
		if (slideCount <= 1) {
			return;
		}

		const timer = setInterval(() => {
			setActiveIndex((current) => (current + 1) % slideCount);
		}, SLIDE_INTERVAL_MS);

		return () => clearInterval(timer);
	}, [slideCount]);

	if (slideCount === 0) {
		return null;
	}

	return (
		<>
			<div aria-hidden className="absolute inset-0">
				{imageKeys.map((key, index) => (
					<Image
						alt=""
						className="object-cover transition-opacity duration-1000 ease-in-out"
						fill
						key={key}
						priority={index === 0}
						sizes="100vw"
						src={staticCdnUrl(key)}
						style={{ opacity: index === activeIndex ? 1 : 0 }}
					/>
				))}
			</div>

			{slideCount > 1 ? (
				<div className="absolute right-0 bottom-8 left-0 z-10 flex justify-center gap-3">
					{imageKeys.map((key, index) => (
						<button
							aria-current={index === activeIndex}
							aria-label={`Show slide ${index + 1}`}
							className="h-2 rounded-full bg-white/40 transition-all duration-300 hover:bg-white/70 aria-[current=true]:w-8 aria-[current=true]:bg-brand-surface data-[current=false]:w-2"
							data-current={index === activeIndex}
							key={key}
							onClick={() => goTo(index)}
							type="button"
						/>
					))}
				</div>
			) : null}
		</>
	);
}
