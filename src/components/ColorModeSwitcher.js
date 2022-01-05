import React from "react";
import { useColorMode, useColorModeValue, IconButton } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { FaMoon, FaSun } from "react-icons/fa";

export const ColorModeSwitcher = props => {
  const { toggleColorMode } = useColorMode();
  const activeButton = useColorModeValue(
    "0 0 0 3px rgba(10, 125, 230, 0.4)",
    "0 0 0 3px rgba(110, 125, 230, 0.8)"
  );

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        style={{ display: "inline-block" }}
        key={useColorModeValue("dark", "light")}
        initial={{ x: 10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -10, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <IconButton
          aria-label="Toggle theme"
          colorScheme={useColorModeValue("purple", "orange")}
          icon={useColorModeValue(<FaMoon />, <FaSun />)}
          onClick={toggleColorMode}
          _focus={{ boxShadow: activeButton }}
        />
      </motion.div>
    </AnimatePresence>
  );
};
