import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, handleApiError, isApiError } from "../api-client";
import { CreateGuestRequest, Guest } from "../types";
import { eventKeys } from "./use-events";

export const useCreateGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: CreateGuestRequest;
    }) => apiClient.createGuest(eventId, data),
    onSuccess: (newGuest, { eventId }) => {
      queryClient.setQueryData(
        eventKeys.guests(eventId),
        (oldGuests: unknown) => {
          if (Array.isArray(oldGuests)) {
            return [...oldGuests, newGuest];
          }
          return [newGuest];
        }
      );

      queryClient.setQueryData(
        eventKeys.details(eventId),
        (oldData: unknown) => {
          if (
            oldData &&
            typeof oldData === "object" &&
            "event" in oldData &&
            "analytics" in oldData
          ) {
            const data = oldData as {
              event: { guests: Guest[] };
              analytics: { hourly: { hour: string; count: number }[] };
            };
            const updatedGuests = [...data.event.guests, newGuest];
            const maleCount = updatedGuests.filter(
              (g: Guest) => g.gender === "MALE"
            ).length;
            const femaleCount = updatedGuests.filter(
              (g: Guest) => g.gender === "FEMALE"
            ).length;

            return {
              ...oldData,
              event: {
                ...data.event,
                guests: updatedGuests,
              },
              analytics: {
                ...data.analytics,
                total: updatedGuests.length,
                male: maleCount,
                female: femaleCount,
                hourly: data.analytics.hourly.map(
                  (h: { hour: string; count: number }) => {
                    const currentHour =
                      new Date().toISOString().substring(0, 13) + ":00:00.000Z";
                    return h.hour === currentHour
                      ? { ...h, count: h.count + 1 }
                      : h;
                  }
                ),
              },
            };
          }
          return oldData;
        }
      );

      queryClient.invalidateQueries({ queryKey: eventKeys.details(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.guests(eventId) });

      toast.success("Guest Added", {
        description: `${newGuest.name} has been added to the event.`,
      });
    },
    onError: (error) => {
      const message = isApiError(error)
        ? handleApiError(error)
        : "Failed to add guest";
      toast.error("Failed to Add Guest", {
        description: message,
      });
    },
  });
};

export const useDeleteGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, guestId }: { eventId: string; guestId: string }) =>
      apiClient.deleteGuest(eventId, guestId),
    onSuccess: (data, { eventId, guestId }) => {
      queryClient.setQueryData(
        eventKeys.guests(eventId),
        (oldGuests: unknown) => {
          if (Array.isArray(oldGuests)) {
            return oldGuests.filter((guest: Guest) => guest.id !== guestId);
          }
          return oldGuests;
        }
      );

      queryClient.setQueryData(
        eventKeys.details(eventId),
        (oldData: unknown) => {
          if (
            oldData &&
            typeof oldData === "object" &&
            "event" in oldData &&
            "analytics" in oldData
          ) {
            const data = oldData as {
              event: { guests: Guest[] };
              analytics: { hourly: { hour: string; count: number }[] };
            };
            const guestToRemove = data.event.guests.find(
              (g: Guest) => g.id === guestId
            );
            if (!guestToRemove) return oldData;

            const updatedGuests = data.event.guests.filter(
              (g: Guest) => g.id !== guestId
            );
            const maleCount = updatedGuests.filter(
              (g: Guest) => g.gender === "MALE"
            ).length;
            const femaleCount = updatedGuests.filter(
              (g: Guest) => g.gender === "FEMALE"
            ).length;

            return {
              ...oldData,
              event: {
                ...data.event,
                guests: updatedGuests,
              },
              analytics: {
                ...data.analytics,
                total: updatedGuests.length,
                male: maleCount,
                female: femaleCount,
              },
            };
          }
          return oldData;
        }
      );

      queryClient.invalidateQueries({ queryKey: eventKeys.details(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.guests(eventId) });

      toast.success("Guest Removed", {
        description: "The guest has been removed from the event.",
      });
    },
    onError: (error) => {
      const message = isApiError(error)
        ? handleApiError(error)
        : "Failed to remove guest";
      toast.error("Failed to Remove Guest", {
        description: message,
      });
    },
  });
};
