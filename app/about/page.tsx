"use client";
import { fireConfetti } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode, useState } from "react";
import { FaCalendarCheck, FaGithub, FaScroll } from "react-icons/fa6";
import { IoLogoFigma } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";

const iconInteract =
  "cursor-pointer hover:text-secondary hover:scale-115 hover:rotate-5 transition-all";

function BioDropdown({
  name,
  icon,
  children,
}: {
  name: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        className="flex gap-2.5 select-none items-center cursor-pointer transition-all hover:text-secondary-darker hover:scale-105"
        title="Click to open Bios"
      >
        <div className="text-sm text-secondary-darker">{icon}</div>

        {name}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            key="bio"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden text-sm leading-relaxed"
          >
            <div className=" mb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function AboutPage() {
  return (
    <div className="w-screen h-screen bg-secondary-light flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center gap-8"
      >
        <div className="flex flex-col items-center gap-2">
          <div
            title="Surprise?"
            className={`hidden select-none lg:block transform hover:scale-105 text-6xl
              transition-all cursor-pointer font-sans-logo hover:text-secondary text-secondary-darker`}
            onClick={fireConfetti}
          >
            ConCaly
          </div>
          <div className="text-sm select-none">Ending Credits</div>
        </div>

        <div className="flex flex-col items-center gap-1 max-w-xs">
          <BioDropdown name="Andrew Yong" icon={<FaMapMarkerAlt />}>
            As{" "}
            <a
              href="https://andrwyoung.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline cursor-pointer text-secondary-darker hover:text-secondary"
            >
              an artist
            </a>{" "}
            doing Artist Alleys, I found that it was hard to find and track
            deadlines, so I made this app.
          </BioDropdown>

          <BioDropdown name="Sanskar Gyawali" icon={<FaCalendarCheck />}>
            Sanskar helped with grabbing and figuring out the initial data set.
            Thanks!{" "}
            <a
              href="https://github.com/sunscarr/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline cursor-pointer text-secondary-darker hover:text-secondary transition-colors"
            >
              His Github
            </a>
          </BioDropdown>
        </div>

        <div className="flex flex-row gap-4 items-center text-secondary-darker text-2xl">
          <a
            href="https://www.figma.com/design/M9GYa5tcarEDOCRDmONnZz/Convention-Searcher?node-id=0-1&p=f"
            target="_blank"
            rel="noopener noreferrer"
            title="Figma Prototype"
          >
            <IoLogoFigma className={iconInteract} />
          </a>
          <a
            href="https://github.com/andrwyoung/con-app"
            target="_blank"
            rel="noopener noreferrer"
            title="All the Code"
          >
            <FaGithub className={iconInteract} />
          </a>

          <a
            href="https://www.notion.so/jondrew/ConCaly-Writeup-1e72e809fa4e80f7b714c8f6cf848809"
            target="_blank"
            rel="noopener noreferrer"
            title="Writeup + Devlog"
          >
            <FaScroll className={`ml-1 ${iconInteract}`} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
