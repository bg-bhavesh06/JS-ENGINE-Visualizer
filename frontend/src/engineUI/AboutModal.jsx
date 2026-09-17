import { motion, AnimatePresence } from "framer-motion";

const AboutModal = ({ isOpen, onClose, title, description, points = [], examples = [], onReadMore }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ background: "rgba(3, 7, 18, 0.65)", backdropFilter: "blur(8px)", zIndex: 1050 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="engine-panel p-3.5 p-sm-4 w-100 text-start" 
            style={{ maxWidth: "420px", background: "rgba(20, 20, 24, 0.96)", border: "1px solid rgba(59, 130, 246, 0.35)", borderRadius: "12px" }}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom border-secondary border-opacity-25">
              <h5 className="mb-0 text-white fw-bold" style={{ fontSize: "1.05rem" }}>{title}</h5>
              <button type="button" onClick={onClose} className="btn btn-link p-0 text-decoration-none text-secondary fs-5 lh-1">
                ✕
              </button>
            </div>

            {/* Description */}
            <p className="mb-3 small text-slate-300" style={{ lineHeight: "1.5" }}>
              {description}
            </p>

            {/* White Box for Points & Examples */}
            <div 
              className="mb-3 p-3 rounded" 
              style={{ background: "#ffffff", color: "#0f172a", borderRadius: "8px" }}
            >
              {points.length > 0 && (
                <ul className="mb-0 ps-3 small d-flex flex-column gap-1.5" style={{ color: "#0f172a", fontWeight: "500", lineHeight: "1.4" }}>
                  {points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              )}

              {examples.length > 0 && (
                <div className={`${points.length > 0 ? "mt-2.5 pt-2 border-top" : ""}`} style={{ borderColor: "#cbd5e1" }}>
                  <div className="fw-bold mb-1" style={{ fontSize: "0.78rem", color: "#0f172a" }}>
                    Examples
                  </div>
                  <ul className="mb-0 ps-3 small d-flex flex-column gap-1" style={{ color: "#0f172a", fontWeight: "500" }}>
                    {examples.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer / Read More */}
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none small fw-bold"
                style={{ color: "var(--accent-primary)" }}
                onClick={onReadMore || (() => console.log(`${title} Read More clicked`))}
              >
                Read More →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutModal;
