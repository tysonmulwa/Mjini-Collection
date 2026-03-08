import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const WhatsAppFloat = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="https://wa.me/254703739265?text=Hi%20Mjini%20Collections!%20I%20need%20help%20with..."
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-5 right-5 z-50 md:bottom-8 md:right-8 w-14 h-14 min-h-[56px] min-w-[56px] rounded-full bg-[hsl(142_70%_45%)] text-white shadow-lg hover:shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.a>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppFloat;
