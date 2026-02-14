const FloatingPollen = () => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 3 + Math.random() * 5,
    delay: `${Math.random() * 6}s`,
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
};

export default FloatingPollen;
