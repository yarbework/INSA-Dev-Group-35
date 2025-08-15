import React, { useEffect, useState } from "react";

type TimerProps = {
  initialMinutes: number; // in minutes
  onTimeUp: () => void;
};

export const Timer: React.FC<TimerProps> = ({ initialMinutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // convert minutes to seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const intervalId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000); // update every second
    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const timeColor =
    timeLeft < 60 ? "text-red-500 animate-pulse" : "text-gray-900";

  return (
    <div className={`font-mono text-xl font-bold p-2 rounded-lg ${timeColor}`}>
      <span>{String(minutes).padStart(2, "0")}</span> :{" "}
      <span>{String(seconds).padStart(2, "0")}</span>
    </div>
  );
};
