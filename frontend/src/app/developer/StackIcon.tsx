"use client";

import Image from "next/image";

export type StackIconName =
  | "html"
  | "css"
  | "sass"
  | "js"
  | "react"
  | "firebase"
  | "github"
  | "gitlab"
  | "tailwind"
  | "nextjs"
  | "bootstrap"
  | "vercel";

type Props = {
  name: StackIconName;
  alt?: string;
  size?: number;
};

const SRC: Record<StackIconName, string> = {
  html: "/stack/html.svg",
  css: "/stack/css.svg",
  sass: "/stack/sass.svg",
  js: "/stack/js.svg",
  react: "/stack/react.svg",
  firebase: "/stack/firebase.svg",
  github: "/stack/github.svg",
  gitlab: "/stack/gitlab.svg",
  tailwind: "/stack/tailwind.svg",
  nextjs: "/stack/nextjs.svg",
  bootstrap: "/stack/bootstrap.svg",
  vercel: "/stack/vercel.svg",
};

export default function StackIcon({ name, alt = name, size = 64 }: Props) {
  const src = SRC[name];
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image src={src} alt={alt} fill sizes={`${size}px`} />
    </div>
  );
}