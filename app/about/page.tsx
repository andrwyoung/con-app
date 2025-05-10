"use client";
import { fireConfetti } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode, useState } from "react";
import {
  FaCalendarCheck,
  FaGithub,
  FaPatreon,
  FaScroll,
} from "react-icons/fa6";
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
        className="flex gap-1 select-none items-center cursor-pointer duration-200 transition-all
        hover:text-secondary-darker hover:scale-105 font-semibold"
        title="Click to open Bios"
      >
        <div className="text-sm text-secondary-darker">{icon}</div>

        {name}
        {/* <FaCaretDown
          className={`text-sm text-secondary-darker translate-y-0.5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        /> */}
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
            <div className=" mb-4 text-center">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function AboutPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);

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

          <div className="max-w-xs text-center text-sm">
            Thank you for your support! If you have any feedback or suggestions
            fill out this form{" "}
            <a
              href="https://andrwyoung.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline cursor-pointer text-secondary-darker hover:text-secondary"
            >
              here
            </a>{" "}
            or shoot me an email{" "}
            <button
              type="button"
              className="w-fit cursor-pointer text-secondary-darker hover:text-secondary hover:underline"
              onClick={() => {
                navigator.clipboard.writeText("andrew@jonadrew.com");
                setCopiedEmail(true);
                setTimeout(() => setCopiedEmail(false), 2000);
              }}
            >
              {copiedEmail ? "(email copied!)" : "(copy email)"}
            </button>
          </div>
        </div>

        {/* <hr className="w-24 border-t border-secondary-darker" /> */}

        <div className="flex flex-col items-center gap-2">
          <div className="text-sm select-none text-secondary-darker">
            Ending Credits:
          </div>

          <div className="flex flex-col items-center gap-2 max-w-xs -translate-x-[3px]">
            <BioDropdown name="andrwyoung" icon={<FaMapMarkerAlt />}>
              Did some cons a while back as an{" "}
              <a
                href="https://andrwyoung.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline cursor-pointer text-secondary-darker hover:text-secondary"
              >
                an artist
              </a>
            </BioDropdown>

            <BioDropdown name="sunscarr" icon={<FaCalendarCheck />}>
              Figured out a lot of the initial data
            </BioDropdown>
          </div>
        </div>

        <div className="flex flex-row gap-5 items-center text-secondary-darker text-2xl">
          {/* <a
            href="https://www.figma.com/design/M9GYa5tcarEDOCRDmONnZz/Convention-Searcher?node-id=0-1&p=f"
            target="_blank"
            rel="noopener noreferrer"
            title="Figma Prototype"
          >
            <IoLogoFigma className={iconInteract} />
          </a> */}

          <a
            href="patreon.com/concaly"
            target="_blank"
            rel="noopener noreferrer"
            title="Patreon Page"
          >
            <FaPatreon className={`${iconInteract} size-5 `} />
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
            <FaScroll className={` ${iconInteract}`} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
