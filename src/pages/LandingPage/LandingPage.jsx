import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import './LandingPage.css';

const SHOWCASE_ITEMS = [
  {
    id: 'profile',
    title: 'Intelligence Mapping',
    description: 'Map your core expertise and mastery levels to build your unique AI-ready profile.',
    img: '/showcase/skill_entry.png',
  },
  {
    id: 'dashboard',
    title: 'Dynamic Workspace',
    description: 'Get real-time insights into your team composition and skill distribution at a glance.',
    img: '/showcase/dashboard.png',
  },
  {
    id: 'teams',
    title: 'AI Synthesis',
    description: 'Automated team formation using advanced neural matching to ensure peak performance and stability.',
    img: '/showcase/workspace.png',
  },
  {
    id: 'analytics',
    title: 'Deep Behavioral Analytics',
    description: 'Deep-dive into team dimensions, compatibility scores, and performance metrics.',
    img: '/showcase/analytics.png',
  },
];

export default function LandingPage({ onLaunch }) {
  const containerRef = useRef(null);
  
  // Initialize Lenis for smooth scroll on landing page only
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // refined exponential out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1, // slightly more responsive to wheel
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
      lerp: 0.05,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="landing-container" ref={containerRef}>
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <div className="landing-badge">AI Team Synthesis v8.1</div>
          <h1 className="hero-title">
            Intelligence <br />
            <span className="grad-text">Synthesized.</span>
          </h1>
          <p className="hero-subtitle">
            Aura leverages advanced neural mapping to build high-performance,
            balanced teams through deep skill analytics and behavioral insights.
          </p>
          <button className="launch-btn glow-primary" onClick={onLaunch}>
            Launch Workspace →
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="scroll-indicator"
        >
          <span className="material-symbols-outlined">expand_more</span>
          <span>Explore Platform</span>
        </motion.div>
      </section>

      {/* Feature Showcase */}
      {SHOWCASE_ITEMS.map((item, index) => (
        <ShowcaseSection
          key={item.id}
          item={item}
          index={index}
          total={SHOWCASE_ITEMS.length}
        />
      ))}

      {/* Final CTA */}
      <section className="final-cta">
        <div className="glass cta-card">
          <h2 className="cta-title">Ready to build your <span className="grad-text">Aura?</span></h2>
          <p className="cta-text">Enter the intelligence workspace and start building high-performance teams today.</p>
          <button className="btn-primary cta-launch-btn" onClick={onLaunch}>
            Enter Intelligence Workspace
          </button>
        </div>
      </section>

      {/* Interative Neural Mesh Background */}
      <InteractiveMesh />
      
      {/* Background ambient elements */}
      <div className="ambient-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
    </div>
  );
}

function InteractiveMesh() {
  const [nodes, setNodes] = useState([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Generate initial node positions
  useEffect(() => {
    const initialNodes = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 10,
      speed: Math.random() * 2 + 1,
    }));
    setNodes(initialNodes);
  }, []);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="interactive-mesh-container">
      <svg className="mesh-lines-svg">
        {nodes.map((node, i) => 
          nodes.slice(i + 1).map((target) => {
            const dist = Math.sqrt(Math.pow(node.x - target.x, 2) + Math.pow(node.y - target.y, 2));
            if (dist < 25) { // Only connect nearby nodes
              return (
                <MeshLine 
                  key={`${node.id}-${target.id}`} 
                  start={node} 
                  end={target} 
                  mouseX={mouseX} 
                  mouseY={mouseY} 
                />
              );
            }
            return null;
          })
        )}
      </svg>
      {nodes.map((node) => (
        <VectorNode 
          key={node.id} 
          node={node} 
          mouseX={mouseX} 
          mouseY={mouseY} 
        />
      ))}
    </div>
  );
}

function VectorNode({ node, mouseX, mouseY }) {
  const springConfig = { damping: 20, stiffness: 100 };
  const baseTransX = useMotionValue(0);
  const baseTransY = useMotionValue(0);
  
  const x = useSpring(baseTransX, springConfig);
  const y = useSpring(baseTransY, springConfig);

  useEffect(() => {
    const updatePosition = () => {
      // Base floating animation
      const time = Date.now() / 2000;
      const moveX = Math.sin(time * node.speed) * 20;
      const moveY = Math.cos(time * node.speed) * 20;

      // Mouse repulsion
      const rect = { left: window.innerWidth * (node.x / 100), top: window.innerHeight * (node.y / 100) };
      const dx = mouseX.get() - rect.left;
      const dy = mouseY.get() - rect.top;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      let repulseX = 0;
      let repulseY = 0;
      
      if (dist < 200) {
        const force = (200 - dist) / 200;
        repulseX = -(dx / dist) * force * 100;
        repulseY = -(dy / dist) * force * 100;
      }

      baseTransX.set(moveX + repulseX);
      baseTransY.set(moveY + repulseY);
      
      requestAnimationFrame(updatePosition);
    };

    const raf = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(raf);
  }, [node, mouseX, mouseY]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${node.x}%`,
        top: `${node.y}%`,
        x,
        y,
        width: node.size,
        height: node.size,
      }}
      className="vector-sphere"
    />
  );
}

function MeshLine({ start, end, mouseX, mouseY }) {
  // Simplification: Lines are static for now, but in a real app 
  // they would sync with the spheres. Since spheres use absolute %, 
  // lines can use the same %.
  return (
    <line
      x1={`${start.x}%`}
      y1={`${start.y}%`}
      x2={`${end.x}%`}
      y2={`${end.y}%`}
      className="mesh-line"
    />
  );
}

function ShowcaseSection({ item, index, total }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section className="showcase-section" ref={ref}>
      <div className="showcase-content-grid">
        <motion.div
          style={{ y, opacity }}
          className="showcase-text-col"
        >
          <span className="section-step">Step {index + 1} of {total}</span>
          <h2 className="showcase-title">{item.title}</h2>
          <p className="showcase-desc">{item.description}</p>
        </motion.div>

        <motion.div
          style={{ scale, opacity }}
          className="showcase-img-col"
        >
          <div className="img-frame glass">
            <img src={item.img} alt={item.title} className="showcase-img" />
            <div className="img-glow"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
