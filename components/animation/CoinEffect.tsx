import { motion, AnimatePresence } from "framer-motion";

type CoinEffectProps = {
  coinEffect: {
    id: number;
    value: number;
  } | null;
};

export const CoinEffect = ({ coinEffect }: CoinEffectProps) => {
  return (
    <AnimatePresence>
      {coinEffect && (
        <motion.span
          key={coinEffect.id}
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -10, scale: 1.1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-yellow-500 text-2xl font-extrabold pointer-events-none select-none"
        >
          +{coinEffect.value}
        </motion.span>
      )}
    </AnimatePresence>
  );
};
