import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, FileCheck2, PlayCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Counter } from "./Counter";
import heroPoster from "@/assets/hero-poster.jpg";

const floatingCards = [
  { label: "Properties managed", value: 1240, suffix: "+", className: "left-[4%] top-[24%]" },
  { label: "Receipts generated", value: 98500, suffix: "+", className: "right-[5%] top-[18%]" },
  { label: "Monthly income", value: 42, prefix: "KSh ", suffix: "M", className: "left-[8%] bottom-[16%]" },
  { label: "Happy tenants", value: 15600, suffix: "+", className: "right-[7%] bottom-[22%]" },
];

export function Hero() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPointer({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <video
        className="absolute inset-0 size-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={heroPoster}
      >
        <source
          src="https://videos.pexels.com/video-files/2792370/2792370-hd_1920_1080_30fps.mp4"
          type="video/mp4"
        />
        <source
          src="https://videos.pexels.com/video-files/3254006/3254006-hd_1920_1080_25fps.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-[oklch(0.14_0.02_50_/_0.78)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.72_0.2_47_/_0.35),transparent_55%),radial-gradient(circle_at_80%_70%,oklch(0.52_0.18_38_/_0.4),transparent_60%)] animate-aurora" />

      {floatingCards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ transform: `translate3d(${pointer.x * (10 + i * 5)}px, ${pointer.y * (8 + i * 4)}px, 0)` }}
          className={`glass-strong absolute hidden w-44 rounded-3xl p-4 text-white lg:block ${card.className} ${
            i % 2 === 0 ? "animate-float" : "animate-float-slow"
          }`}
        >
          <p className="font-display text-2xl font-bold">
            <Counter to={card.value} prefix={card.prefix ?? ""} suffix={card.suffix ?? ""} />
          </p>
          <p className="mt-1 text-xs text-white/70">{card.label}</p>
        </motion.div>
      ))}

      <div className="relative mx-auto w-full max-w-4xl px-6 py-32 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-strong inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white"
        >
          <FileCheck2 className="size-3.5" /> QR-verified digital receipts by Codevanta Ventures
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-display text-4xl leading-[1.05] font-bold text-white sm:text-6xl lg:text-7xl"
        >
          RentReceipt — Simple Rent & Property Management
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-base text-white/75 sm:text-lg"
        >
          RentReceipt helps landlords and property managers in Kenya manage properties, tenants,
          rent payments and professional rent receipts from one platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg" className="rounded-full shadow-glow">
            <Link to="/auth" search={{ mode: "signup" }}>
              Get Started <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="rounded-full">
            <Link to="/auth">Login</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="glass rounded-full text-white">
            <Link to="/tenant">
              <Users className="mr-1 size-4" /> Tenant Portal
            </Link>
          </Button>
          <a
            href="#preview"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            <PlayCircle className="size-5" /> Watch demo
          </a>
        </motion.div>
      </div>
    </section>
  );
}