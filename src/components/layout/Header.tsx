"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { brand, navLinks } from "@/lib/data/site-data";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(0, 0, 0,0.08)] bg-[#ffffff]/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="group flex items-center">
          <Image
            src={brand.logo}
            alt={brand.name}
            width={140}
            height={180}
            unoptimized
            className="h-14 w-auto object-contain transition group-hover:opacity-90 sm:h-16"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.65rem] font-medium tracking-[0.14em] text-[#525252] uppercase transition hover:text-[#000000]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="text-[#171717] lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-[rgba(0, 0, 0,0.08)] px-6 py-6 lg:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm tracking-[0.12em] text-[#525252] uppercase"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
