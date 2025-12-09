import React, { useEffect, useState } from 'react';

const Sparkle: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div style={style} className="absolute pointer-events-none animate-pulse text-yellow-300 select-none">
    ✨
  </div>
);

const Sparkles: React.FC = () => {
  const [sparkles, setSparkles] = useState<{ id: number; style: React.CSSProperties }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        fontSize: `${Math.random() * 20 + 10}px`,
        transform: `rotate(${Math.random() * 360}deg)`,
      };
      
      setSparkles(prev => [...prev.slice(-10), { id, style }]); // Keep max 11 sparkles
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map(s => <Sparkle key={s.id} style={s.style} />)}
    </div>
  );
};

export default Sparkles;
