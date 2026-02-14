import { memo } from "react";

const FloatingPollen = memo(() => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${(i * 8.3) % 100}%`,
    top: `${(i * 7.7 + 10) % 100}%`,
    size: 3 + (i % 3) * 2,
    delay: `${(i * 0.5) % 6}s`,
    anim: i % 2 === 0 ? "animate-pollen" : "animate-pollen-2",
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full bg-primary/30 ${p.anim}`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
});

FloatingPollen.displayName = "FloatingPollen";

export default FloatingPollen;
