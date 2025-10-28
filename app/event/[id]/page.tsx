"use client";

import { AnalyticsChart } from "@/components/AnalyticsChart";
import { EventTimer } from "@/components/EventTimer";
import { GuestCounters } from "@/components/GuestCounters";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
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
import {
  useCompleteEvent,
  useEventDetails,
  useExportCSV,
  useResetGuests,
} from "@/lib/hooks/use-events";
import { useCreateGuest, useDeleteGuest } from "@/lib/hooks/use-guests";
import { useWebSocket } from "@/lib/hooks/use-websocket";
import { EventStatus, Gender } from "@/lib/types";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle,
  Clock,
  Download,
  Loader2,
  RotateCcw,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function EventDashboard() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestGender, setNewGuestGender] = useState<Gender>(Gender.MALE);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showBackDialog, setShowBackDialog] = useState(false);

  const {
    data: eventData,
    isLoading,
    error,
    refetch,
  } = useEventDetails(eventId);
  const createGuestMutation = useCreateGuest();
  const deleteGuestMutation = useDeleteGuest();
  const completeEventMutation = useCompleteEvent();
  const resetGuestsMutation = useResetGuests();
  const exportCSVMutation = useExportCSV();

  useWebSocket(eventId);

  const event = eventData?.event;
  const analytics = eventData?.analytics;

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim() || !event) return;

    createGuestMutation.mutate(
      {
        eventId,
        data: {
          name: newGuestName.trim(),
          gender: newGuestGender,
        },
      },
      {
        onSuccess: () => {
          setNewGuestName("");
        },
      }
    );
  };

  const handleRemoveGuest = async (guestId: string) => {
    if (!event) return;

    deleteGuestMutation.mutate({
      eventId,
      guestId,
    });
  };

  const handleCompleteEvent = async () => {
    if (!event) return;

    completeEventMutation.mutate(eventId);
  };

  const handleResetGuests = async () => {
    if (!event) return;

    resetGuestsMutation.mutate(eventId, {
      onSuccess: () => {
        setShowResetDialog(false);
      },
    });
  };

  const handleDownloadCSV = () => {
    if (!event || event.status !== EventStatus.COMPLETED) return;

    exportCSVMutation.mutate(eventId);
  };

  const handleBackToHome = () => {
    if (!event) return;

    completeEventMutation.mutate(eventId, {
      onSuccess: () => {
        toast.info("Event Marked as Completed", {
          description: "Going back to home marks the event as finished.",
          duration: 3000,
        });
        setShowBackDialog(false);
        router.push("/");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="p-8 text-center shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Loading Event...
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Please wait while we fetch the event details.
          </CardDescription>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="p-8 text-center shadow-lg">
          <CardTitle className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
            Event Not Found
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            The event you are looking for does not exist or has been removed.
          </CardDescription>
          <div className="space-x-4 flex items-center justify-center">
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="p-8 text-center shadow-lg">
          <CardTitle className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
            Event Not Found
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            The event you are looking for does not exist or has been removed.
          </CardDescription>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="flex items-center w-full">
              {event.status === EventStatus.ACTIVE ? (
                <AlertDialog
                  open={showBackDialog}
                  onOpenChange={setShowBackDialog}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Home
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Leave Event</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to go back to home? This will mark
                        the current event as completed and finished. You can
                        still access the event later, but it will be in
                        completed status.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Stay in Event</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleBackToHome}
                        className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-600"
                      >
                        Leave Event
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button variant="outline" onClick={() => router.push("/")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {event.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Event Dashboard • {event.guests.length} guests registered
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Event Timer
              </CardTitle>
              <CardDescription>
                Time elapsed since event started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventTimer
                startTime={new Date(event.startedAt)}
                isCompleted={event.status === EventStatus.COMPLETED}
                completedAt={
                  event.completedAt ? new Date(event.completedAt) : undefined
                }
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Guest Counters
              </CardTitle>
              <CardDescription>Real-time guest statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <GuestCounters
                total={analytics?.total || 0}
                male={analytics?.male || 0}
                female={analytics?.female || 0}
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-1 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add New Guest
              </CardTitle>
              <CardDescription>
                Add guests to the event with their name and gender
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddGuest} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newGuestName">Guest Name</Label>
                    <Input
                      id="newGuestName"
                      placeholder="Enter guest name..."
                      value={newGuestName}
                      onChange={(e) => setNewGuestName(e.target.value)}
                      disabled={
                        event.status === EventStatus.COMPLETED ||
                        createGuestMutation.isPending
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={
                          newGuestGender === Gender.MALE ? "default" : "outline"
                        }
                        onClick={() => setNewGuestGender(Gender.MALE)}
                        disabled={
                          event.status === EventStatus.COMPLETED ||
                          createGuestMutation.isPending
                        }
                        className="flex-1"
                      >
                        Male
                      </Button>
                      <Button
                        type="button"
                        variant={
                          newGuestGender === Gender.FEMALE
                            ? "default"
                            : "outline"
                        }
                        onClick={() => setNewGuestGender(Gender.FEMALE)}
                        disabled={
                          event.status === EventStatus.COMPLETED ||
                          createGuestMutation.isPending
                        }
                        className="flex-1"
                      >
                        Female
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={
                    !newGuestName.trim() ||
                    event.status === EventStatus.COMPLETED ||
                    createGuestMutation.isPending
                  }
                  className="w-full"
                >
                  {createGuestMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding Guest...
                    </>
                  ) : (
                    "Add Guest"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Guest List
              </CardTitle>
              <CardDescription>
                {event.guests.length} guests registered
              </CardDescription>
            </CardHeader>
            <CardContent>
              {event.guests.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No guests registered yet
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {event.guests.map((guest) => (
                    <div
                      key={guest.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-semibold text-sm">
                          {guest.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{guest.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {guest.gender} •{" "}
                            {new Date(guest.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveGuest(guest.id)}
                        disabled={
                          event.status === EventStatus.COMPLETED ||
                          deleteGuestMutation.isPending
                        }
                      >
                        {deleteGuestMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-3 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Hourly Analytics
              </CardTitle>
              <CardDescription>
                Real-time guest registration trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics && analytics.hourly.length > 0 ? (
                <AnalyticsChart data={analytics.hourly} />
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No analytics data available.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-1 shadow-lg">
            <CardHeader>
              <CardTitle>Event Actions</CardTitle>
              <CardDescription>Manage your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {event.status === EventStatus.ACTIVE ? (
                <>
                  <Button
                    onClick={handleCompleteEvent}
                    disabled={completeEventMutation.isPending}
                    className="w-full"
                  >
                    {completeEventMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Event
                      </>
                    )}
                  </Button>

                  <AlertDialog
                    open={showResetDialog}
                    onOpenChange={setShowResetDialog}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        disabled={
                          resetGuestsMutation.isPending ||
                          event.guests.length === 0
                        }
                        variant="outline"
                        className="w-full"
                      >
                        {resetGuestsMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Resetting...
                          </>
                        ) : (
                          <>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset Guests
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset All Guests</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reset all guests? This will
                          remove all{" "}
                          <span className="font-semibold">
                            {event.guests.length}
                          </span>{" "}
                          guests from the event. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleResetGuests}
                          className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                          Reset All Guests
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <Button
                  onClick={handleDownloadCSV}
                  className="w-full"
                  disabled={
                    event.guests.length === 0 || exportCSVMutation.isPending
                  }
                >
                  {exportCSVMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle>Event Summary</CardTitle>
              <CardDescription>
                Overview of event status and details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Status:
                </span>
                <Badge
                  variant={
                    event.status === EventStatus.ACTIVE
                      ? "default"
                      : "secondary"
                  }
                >
                  {event.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Started:
                </span>
                <span className="text-sm">
                  {new Date(event.startedAt).toLocaleString()}
                </span>
              </div>
              {event.completedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Completed:
                  </span>
                  <span className="text-sm">
                    {new Date(event.completedAt).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Total Guests:
                </span>
                <span className="font-medium">{event.guests.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
