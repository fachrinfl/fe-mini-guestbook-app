"use client";

import { User, UserCheck, Users } from "lucide-react";

interface GuestCountersProps {
  total: number;
  male: number;
  female: number;
}

export function GuestCounters({ total, male, female }: GuestCountersProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
          {total}
        </div>
        <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-300">
          <Users className="h-4 w-4" />
          <span>Total</span>
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
          {male}
        </div>
        <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-300">
          <User className="h-4 w-4" />
          <span>Male</span>
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-1">
          {female}
        </div>
        <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-300">
          <UserCheck className="h-4 w-4" />
          <span>Female</span>
        </div>
      </div>
    </div>
  );
}
