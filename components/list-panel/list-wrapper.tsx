// this is the wrapper that helps animate the list panel open and closed

import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import SidebarToggleButton from "./toggle-button";

export default function ListWrapper({
  showListPanel,
  setShowListPanel,
  children,
}: {
  showListPanel: boolean;
  setShowListPanel: (e: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {showListPanel && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" },
          }}
          exit={{
            x: -50,
            opacity: 0,
            transition: { duration: 0.25, ease: "easeIn" },
          }}
          className="origin-left flex flex-col absolute top-0 left-[calc(100%+0.6rem)] gap-2 -z-2"
        >
          <div className="flex">
            {children}

            <SidebarToggleButton
              title="Close List Panel"
              onClick={() => setShowListPanel(false)}
              direction="left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
