"use client";

import React from "react";
import { INSTAGRAM_POSTS } from "@/lib/mock-data";

export const InstagramFeed: React.FC = () => {
  return (
    <section className="py-12 bg-white font-sans">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title Header */}
        <div className="text-center mb-10 space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-zinc-900 uppercase">
            HAPPY CUSTOMERS
          </h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
            TAG US @SAICOLLECTIONPNP ON INSTAGRAM TO GET FEATURED
          </p>
          <div className="w-12 h-0.5 bg-zinc-900 mx-auto mt-2" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-zinc-100 border border-zinc-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-white text-center">
                <span className="text-sm font-bold uppercase tracking-wider mb-1">
                  @SAICOLLECTIONPNP
                </span>
                <p className="text-xs line-clamp-2 text-zinc-200 font-light">
                  {post.caption}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Social Link Button */}
        <div className="mt-8 text-center">
          <a
            href="https://instagram.com/saicollectionpnp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-8 py-3.5 uppercase tracking-widest transition-all"
          >
            FOLLOW @SAICOLLECTIONPNP ON INSTAGRAM →
          </a>
        </div>

      </div>
    </section>
  );
};

