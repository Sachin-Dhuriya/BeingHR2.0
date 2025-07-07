import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./HRConclaveGrid.css";

const images = [
  { src: "/home.jpg", size: "tall" },
  { src: "/home.jpg", size: "wide" },
  { src: "/home.jpg", size: "wide" },
  { src: "/img6.jpg", size: "normal" },
  { src: "/img7.jpg", size: "normal" },
  { src: "/home.jpg", size: "tall" },
  { src: "/home.jpg", size: "normal" },
  { src: "/home.jpg", size: "wide" },
  { src: "/home.jpg", size: "normal" },
  { src: "/home.jpg", size: "normal" },
];

export default function HRConclave() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="hr-container">
      {/* Animate Image Grid from Left */}
      <motion.div
        className="image-grid-masonry"
        initial={{ x: -150, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {images.map((image, i) => (
          <motion.div
            key={i}
            className={`image-card ${image.size}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
          >
            <img src={image.src} alt={`HR Conclave ${i + 1}`} />
          </motion.div>
        ))}
      </motion.div>

      {/* Animate Text Content from Bottom to Top */}
      <motion.div
        className="text-section"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <h2>Your Growth, Our Mission</h2>
        <p>
          BeingHR is India's leading community for HR professionals, offering unmatched
          opportunities to connect, learn, and grow. With over 60,000 members from industries
          like IT, Media, Manufacturing, and Startups, we are redefining HR's role as a
          strategic partner in business success.
        </p>

        <AnimatePresence>
          {showMore && (
            <motion.p
              key="more-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              Whether you're looking to expand your knowledge, learn new skills, connect with
              other professionals, or create new business opportunities, Gain Skills is the
              right partner for you.
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Show Less" : "Know More"}
        </motion.button>
      </motion.div>
    </div>
  );
}
