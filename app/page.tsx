"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateEvent } from "@/lib/hooks/use-events";
import { BarChart3, Calendar, Clock, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [eventName, setEventName] = useState("");
  const router = useRouter();
  const createEventMutation = useCreateEvent();

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) return;

    createEventMutation.mutate(
      { name: eventName.trim() },
      {
        onSuccess: (newEvent) => {
          router.push(`/event/${newEvent.id}`);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Mini Guestbook App
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Simple guest recording for your events with real-time analytics
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Create New Event
                </CardTitle>
                <CardDescription>
                  Start a new event to begin recording guests and tracking
                  attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventName">Event Name</Label>
                    <Input
                      id="eventName"
                      placeholder="Enter event name..."
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      required
                      className="text-lg"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={
                      createEventMutation.isPending || !eventName.trim()
                    }
                  >
                    {createEventMutation.isPending
                      ? "Creating Event..."
                      : "Start Event"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Real-time Guest Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Add guests with name and gender</li>
                    <li>• Live counters for total, male, and female guests</li>
                    <li>• Real-time guest list updates</li>
                    <li>• Easy guest removal if needed</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Event Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Live event timer</li>
                    <li>• Event status management</li>
                    <li>• Complete event when finished</li>
                    <li>• Reset guests if needed</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analytics & Export
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Hourly attendance analytics</li>
                    <li>• Real-time charts and graphs</li>
                    <li>• CSV export for completed events</li>
                    <li>• Comprehensive event summaries</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
