import { memo } from "react";

const Bee = memo(({ delay, startX, startY, size }: { delay: number; startX: number; startY: number; size: string }) => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        zIndex: 30,
        animation: `bee-float-x ${6 + delay * 2}s ease-in-out infinite alternate, bee-float-y ${4 + delay * 1.5}s ease-in-out infinite alternate-reverse`,
        animationDelay: `${delay * 0.5}s`,
      }}
    >
      <span className={`${size} drop-shadow-lg inline-block`} style={{ animation: "bee-bounce 1.5s ease-in-out infinite" }}>
        🐝
      </span>
    </div>
  );
});

Bee.displayName = "Bee";

const AnimatedBee = memo(() => (
  <>
    <Bee delay={0} startX={70} startY={15} size="text-3xl md:text-4xl" />
    <Bee delay={1} startX={60} startY={40} size="text-2xl md:text-3xl" />
    <Bee delay={2} startX={80} startY={55} size="text-xl md:text-2xl" />
  </>
));

AnimatedBee.displayName = "AnimatedBee";

export default AnimatedBee;
