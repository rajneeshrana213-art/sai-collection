"use client";

import React from "react";

const HAPPY_CUSTOMER_STORIES = [
    {
        id: "hc-1",
        imageUrl:
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900",
        alt: "Happy customer in blue ethnic wear",
    },
    {
        id: "hc-2",
        imageUrl:
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=900",
        alt: "Happy customer mirror selfie in festive suit",
    },
    {
        id: "hc-3",
        imageUrl:
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=900",
        alt: "Happy customer in floral dress",
    },
    {
        id: "hc-4",
        imageUrl:
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=900",
        alt: "Happy customer in printed ethnic outfit",
    },
    {
        id: "hc-5",
        imageUrl:
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=900",
        alt: "Happy customer in bright festive suit",
    },
    {
        id: "hc-6",
        imageUrl:
            "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&q=80&w=900",
        alt: "Happy customer at evening event",
    },
    {
        id: "hc-7",
        imageUrl:
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=900",
        alt: "Happy customer in peach ethnic look",
    },
];

export const HappyCustomersSection: React.FC = () => {
    return (
        <section className="bg-white py-16 sm:py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-12">
                    <p className="text-[13px] uppercase tracking-[0.14em] text-zinc-600 font-medium">
                        Happy Faces
                    </p>
                    <h2 className="mt-3 text-4xl sm:text-5xl font-normal uppercase tracking-[0.14em] text-zinc-900">
                        Happy Customers
                    </h2>
                </div>

                <div className="flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto no-scrollbar pb-3">
                    {HAPPY_CUSTOMER_STORIES.map((story) => (
                        <article
                            key={story.id}
                            className="shrink-0 w-40 sm:w-44 lg:w-48 border border-zinc-200 bg-white"
                        >
                            <div className="relative aspect-9/16 overflow-hidden bg-zinc-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={story.imageUrl}
                                    alt={story.alt}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};
