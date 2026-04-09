import { StackHandler } from "@stackframe/stack";
import Link from "next/link"

export default function Handler() {
  return (
    <div className="hero min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[url(/img/home.png)] bg-cover bg-center blur-sm scale-110 -z-10" />

      <div className="hero-overlay"></div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
          <StackHandler fullPage={false} />
        <Link href="/" className="flex justify-center text-white underline">Go Back Home</Link>
        </div>
    </div>

  );
}