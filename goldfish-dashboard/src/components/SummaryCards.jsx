import { useEffect, useState } from "react";

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 400;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return display;
}

export default function SummaryCards({ data }) {

  const latest = data?.[0];

  const safeData = {
    num_fish: Number(latest?.num_fish || 0),
    avg_length_cm: Number(latest?.avg_length_cm || 0),
    feeding_turns: Number(latest?.feeding_turns || 0)
  };

  return (
    <div className="cards">

      <div className="card">
        <p>Total Fish</p>
        <h2>
          <AnimatedNumber value={safeData.num_fish} />
        </h2>
      </div>

      <div className="card">
        <p>Average Length</p>
        <h2>
          <AnimatedNumber value={safeData.avg_length_cm} /> cm
        </h2>
      </div>

      <div className="card">
        <p>Feeding Turns</p>
        <h2>
          <AnimatedNumber value={safeData.feeding_turns} />
        </h2>
      </div>

    </div>
  );
}