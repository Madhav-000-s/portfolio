"use client"

import Navbar from "@/components/Navbar";
import HeroText from "@/components/HeroText";
import Dock from "@/components/Dock";
import TerminalWindow from "@/components/windows/TerminalWindow";
import FinderWindow from "@/components/windows/FinderWindow";
import ResumeWindow from "@/components/windows/ResumeWindow";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroText />
      <Dock />
      <FinderWindow />
      <TerminalWindow />
      <ResumeWindow />
    </main>
  );
}
