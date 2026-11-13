"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

/** Linguagem de movimento: entradas rápidas que desaceleram longamente. */
export const motion = {
  ease: "expo.out",
  easeInOut: "power4.inOut",
  fast: 0.6,
  base: 1.1,
  slow: 1.6,
} as const;

export const REDUCED = "(prefers-reduced-motion: reduce)";
export const FULL = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
