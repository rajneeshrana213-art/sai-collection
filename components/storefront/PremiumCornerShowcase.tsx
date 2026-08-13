"use client";

import React from "react";

const SHOWCASE_VIDEO_SOURCE =
    "https://saicollection.com/cdn/shop/videos/c/vp/5ef7036fa6674caaabd261a801f8e127/5ef7036fa6674caaabd261a801f8e127.HD-1080p-7.2Mbps-33791502.mp4?v=0";

export const PremiumCornerShowcase: React.FC = () => {
    return (
        <section className="bg-white py-16 sm:py-20 lg:py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                    <div className="order-2 lg:order-1 lg:pl-2">
                        <p className="text-[12px] tracking-[0.2em] uppercase text-zinc-500 font-semibold">
                            You Can&apos;t Miss !
                        </p>
                        <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[38px] leading-tight tracking-[0.12em] uppercase text-zinc-900 font-medium max-w-md">
                            Premium Retails Indian Outfit Corner
                        </h2>
                    </div>

                    <div className="order-1 lg:order-2 relative h-130 sm:h-155 lg:h-175">
                        <div className="absolute left-0 bottom-0 z-30 w-[58%] h-[78%] overflow-hidden bg-zinc-100 shadow-sm">
                            <video
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                poster="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1200"
                                aria-label="Premium ethnic outfit video showcase"
                            >
                                <source src={SHOWCASE_VIDEO_SOURCE} type="video/mp4" />
                            </video>
                        </div>

                        <div className="absolute right-0 top-0 z-0 w-[64%] h-[96%] overflow-hidden bg-zinc-100 shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200"
                                alt="Premium festive purple suit set"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
