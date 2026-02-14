import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="py-5 bg-urgency text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Clock className="h-5 w-5" />
          <span className="font-bold text-lg">⏰ বিশেষ ছাড় শেষ হচ্ছে!</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-2xl md:text-4xl font-extrabold">
          <div className="bg-primary-foreground/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[56px]">
            {pad(timeLeft.hours)}
          </div>
          <span className="text-primary-foreground/70">:</span>
          <div className="bg-primary-foreground/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[56px]">
            {pad(timeLeft.minutes)}
          </div>
          <span className="text-primary-foreground/70">:</span>
          <div className="bg-primary-foreground/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[56px]">
            {pad(timeLeft.seconds)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;
