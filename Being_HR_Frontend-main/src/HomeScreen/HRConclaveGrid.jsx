import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import "./HRConclaveGrid.css";

export default function HRConclave() {
  const [showMore, setShowMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [homepageData, setHomepageData] = useState(null);

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/homepage-section");
        setHomepageData(res.data.homepageSection);
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      }
    };

    fetchData();
  }, []);

  const getSizeClass = (i) => {
    const sizes = ["normal", "wide", "tall"];
    return sizes[i % sizes.length];
  };

  if (!homepageData) return <p>Loading...</p>;

  // Split content lines
  const contentLines = homepageData.content.split('\n');

  return (
    <div className="hr-container" ref={ref}>
      {/* ✅ Image Grid */}
      <motion.div
        className="image-grid-masonry"
        initial={{ opacity: 0, y: 100 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {homepageData.images.map((img, i) => (
          <motion.div
            key={img._id}
            className={`image-card ${getSizeClass(i)}`}
            onClick={() => setSelectedImage(img.url)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
          >
            <img src={img.url} alt={img.caption || `Image ${i + 1}`} />
          </motion.div>
        ))}
      </motion.div>

      {/* ✅ Text Section with line breaks preserved */}
      <motion.div
        className="text-section"
        initial={{ opacity: 0, y: 100 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h2>{homepageData.title}</h2>

        <div className="content-preview">
          {contentLines.slice(0, showMore ? contentLines.length : 6).map((line, index) => (
            <p key={index}>{line}</p>
          ))}

          {contentLines.length > 6 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMore(!showMore)}
              className="know-more-btn"
            >
              {showMore ? "Show Less" : "Know More"}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* ✅ Image Popup */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="popup-backdrop"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={selectedImage}
              alt="Popup"
              className="popup-image"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
