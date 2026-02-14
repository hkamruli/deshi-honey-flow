import { useEffect, useState } from "react";

interface BeeProps {
  delay: number;
  startX: number;
  startY: number;
  size: string;
}

const Bee = ({ delay, startX, startY, size }: BeeProps) => {
  const [pos, setPos] = useState({ x: startX, y: startY });
  const [target, setTarget] = useState({ x: startX + 30, y: startY - 20 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTarget({
        x: startX + (Math.random() - 0.5) * 80,
        y: startY + (Math.random() - 0.5) * 60,
      });
    }, 2000 + delay * 500);
    return () => clearInterval(interval);
  }, [startX, startY, delay]);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      setPos((prev) => ({
        x: prev.x + (target.x - prev.x) * 0.02,
        y: prev.y + (target.y - prev.y) * 0.02,
      }));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  const flip = target.x < pos.x ? "scaleX(-1)" : "scaleX(1)";

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: flip,
        transition: "transform 0.3s ease",
        zIndex: 30,
        animationDelay: `${delay * 0.3}s`,
      }}
    >
      <span className={`${size} drop-shadow-lg inline-block animate-bounce`} style={{ animationDuration: "1.5s" }}>
        🐝
      </span>
    </div>
  );
};

const AnimatedBee = () => {
  return (
    <>
      <Bee delay={0} startX={70} startY={15} size="text-3xl md:text-4xl" />
      <Bee delay={1} startX={60} startY={40} size="text-2xl md:text-3xl" />
      <Bee delay={2} startX={80} startY={55} size="text-xl md:text-2xl" />
    </>
  );
};

export default AnimatedBee;
