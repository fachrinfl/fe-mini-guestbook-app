import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, handleApiError, isApiError } from "../api-client";
import { CreateEventRequest } from "../types";

export const eventKeys = {
  all: ["events"] as const,
  details: (eventId: string) => [...eventKeys.all, "details", eventId] as const,
  guests: (eventId: string) => [...eventKeys.all, "guests", eventId] as const,
};

export const useEventDetails = (eventId: string) => {
  return useQuery({
    queryKey: eventKeys.details(eventId),
    queryFn: () => apiClient.getEventDetails(eventId),
    enabled: !!eventId,
    staleTime: 30000,
    retry: (failureCount, error) => {
      if (isApiError(error) && error.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useGuests = (eventId: string) => {
  return useQuery({
    queryKey: eventKeys.guests(eventId),
    queryFn: () => apiClient.getGuests(eventId),
    enabled: !!eventId,
    staleTime: 10000,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => apiClient.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });

      toast.success("Event Created Successfully!", {
        description:
          "Maximum event duration is 24 hours. The event will automatically end after 24 hours.",
        duration: 5000,
      });
    },
    onError: (error) => {
      const message = isApiError(error)
        ? handleApiError(error)
        : "Failed to create event";
      toast.error("Failed to Create Event", {
        description: message,
      });
    },
  });
};

export const useCompleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => apiClient.completeEvent(eventId),
    onSuccess: (data, eventId) => {
      queryClient.setQueryData(
        eventKeys.details(eventId),
        (oldData: unknown) => {
          if (oldData && typeof oldData === "object" && "event" in oldData) {
            return {
              ...oldData,
              event: {
                ...(
                  oldData as { event: { status: string; completedAt?: Date } }
                ).event,
                status: "COMPLETED",
                completedAt: new Date(),
              },
            };
          }
          return oldData;
        }
      );

      queryClient.invalidateQueries({ queryKey: eventKeys.details(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.guests(eventId) });

      toast.success("Event Completed", {
        description: "The event has been marked as completed.",
      });
    },
    onError: (error) => {
      const message = isApiError(error)
        ? handleApiError(error)
        : "Failed to complete event";
      toast.error("Failed to Complete Event", {
        description: message,
      });
    },
  });
};

export const useResetGuests = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => apiClient.resetGuests(eventId),
    onSuccess: (data, eventId) => {
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
              event: { guests: unknown[] };
              analytics: { hourly: { count: number }[] };
            };
            return {
              ...oldData,
              event: {
                ...data.event,
                guests: [],
              },
              analytics: {
                ...data.analytics,
                total: 0,
                male: 0,
                female: 0,
                hourly: data.analytics.hourly.map((h) => ({ ...h, count: 0 })),
              },
            };
          }
          return oldData;
        }
      );

      queryClient.invalidateQueries({ queryKey: eventKeys.details(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.guests(eventId) });

      toast.success("Guests Reset", {
        description: "All guests have been removed from the event.",
      });
    },
    onError: (error) => {
      const message = isApiError(error)
        ? handleApiError(error)
        : "Failed to reset guests";
      toast.error("Failed to Reset Guests", {
        description: message,
      });
    },
  });
};

export const useExportCSV = () => {
  return useMutation({
    mutationFn: (eventId: string) => apiClient.exportEventCSV(eventId),
    onSuccess: (blob, eventId) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `guestbook-${eventId}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("CSV Downloaded", {
        description: "Guest data has been exported successfully.",
      });
    },
    onError: (error) => {
      const message = isApiError(error)
        ? handleApiError(error)
        : "Failed to export CSV";
      toast.error("Failed to Export CSV", {
        description: message,
      });
    },
  });
};
