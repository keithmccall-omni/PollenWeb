"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import Navigation from "@/components/navigation/Navigation";

const teamMembers = [
  {
    name: "Keith McCall",
    title: "Chief Executive Officer",
    image: "/team/keithmccall-headshot.jpg",
    linkedin: "https://www.linkedin.com/in/keithmccall/",
    bio: "Founder, operator, and technology executive with multiple successful exits across enterprise software, geospatial intelligence, AI, and hyperscale infrastructure.",
  },
  {
    name: "Craig Eisler",
    title: "Chief Product and Technology Officer",
    image: "/team/craig.jpeg",
    linkedin: "https://www.linkedin.com/in/craigeisler/",
    bio: "Product and technology leader focused on scalable enterprise systems, platform architecture, cloud operations, and AI-driven product innovation.",
  },
  {
    name: "Tanner Scholten",
    title: "Director of Operations",
    image: "/team/tanner.jpeg",
    linkedin: "https://www.linkedin.com/in/tanner-scholten/",
    bio: "Operations and execution specialist driving organizational efficiency, customer delivery, and day-to-day platform operations.",
  },
];

export default function TeamPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#031B34] text-white">
      {/* Navigation */}
      <Navigation />

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[-200px] top-[-200px] h-[600px] w-[600px] rounded-full bg-[#155A96]/20 blur-3xl" />

        <div className="absolute right-[-200px] bottom-[-200px] h-[600px] w-[600px] rounded-full bg-[#155A96]/10 blur-3xl" />
      </div>

      {/* Team Section */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-28 pb-10 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              className="flex w-[300px] flex-col items-center text-center"
            >
              {/* Circular Image */}
              <div className="relative mb-5">
                <div className="relative h-[190px] w-[190px] overflow-hidden rounded-full border border-[#1E74C6] shadow-[0_0_40px_rgba(21,90,150,0.35)]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                {/* LinkedIn Button */}
                <Link
                  href={member.linkedin}
                  target="_blank"
                  className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#0A66C2] text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#004182]"
                >
                  in
                </Link>
              </div>

              {/* Name */}
              <h2 className="text-3xl font-semibold tracking-tight leading-tight">
                {member.name}
              </h2>

              {/* Title */}
              <p className="mt-3 min-h-[40px] text-[11px] uppercase tracking-[0.24em] leading-5 text-[#D89A72]">
                {member.title}
              </p>

              {/* Accent Line */}
              <div className="my-4 h-[2px] w-14 bg-[#D89A72]" />

              {/* Bio */}
              <p className="max-w-[280px] text-sm leading-7 text-[#D5DFEA]">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}