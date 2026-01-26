import { motion, AnimatePresence } from "framer-motion";

type BackgroundFadeProps = {
  bgIndex: number;
  backgrounds: string[];
};

export const BackgroundFade = ({
  bgIndex,
  backgrounds,
}: BackgroundFadeProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={bgIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className={`absolute inset-0 -z-10 ${backgrounds[bgIndex]}`}
      />
    </AnimatePresence>
  );
};
