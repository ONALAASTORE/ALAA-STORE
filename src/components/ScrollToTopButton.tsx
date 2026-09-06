import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  threshold?: number;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ threshold = 400 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollPosition > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run on initial mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          id="scroll-to-top-button"
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.75, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.75, y: 16 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Scroll to top"
          title="Scroll to top"
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-slate-900/90 hover:bg-[#FF0000] text-white shadow-xl hover:shadow-red-500/25 backdrop-blur-md border border-slate-700/40 transition-colors duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#FF0000]/50"
        >
          <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
