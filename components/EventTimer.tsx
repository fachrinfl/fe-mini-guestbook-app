"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface EventTimerProps {
  startTime: Date;
  isCompleted: boolean;
  completedAt?: Date;
}

export function EventTimer({
  startTime,
  isCompleted,
  completedAt,
}: EventTimerProps) {
  const [duration, setDuration] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endTime = isCompleted && completedAt ? completedAt : now;
      const diff = endTime.getTime() - startTime.getTime();

      if (diff < 0) {
        setDuration("Event not started");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setDuration(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setDuration(`${minutes}m ${seconds}s`);
      } else {
        setDuration(`${seconds}s`);
      }
    };

    updateTimer();

    if (!isCompleted) {
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isCompleted, completedAt]);

  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {duration}
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <Clock className="h-4 w-4" />
        <span>{isCompleted ? "Event Completed" : "Event Running"}</span>
      </div>
    </div>
  );
}
