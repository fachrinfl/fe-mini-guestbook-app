import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { API_CONFIG } from "../config";
import { eventKeys } from "./use-events";

interface WebSocketMessage {
  type:
    | "guest_added"
    | "guest_removed"
    | "event_completed"
    | "guests_reset"
    | "analytics_update";
  eventId: string;
  data?: unknown;
}

export const useWebSocket = (eventId: string | null) => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connect = useCallback(() => {
    if (!eventId || socketRef.current?.connected) return;

    const socket = io(API_CONFIG.WS_URL, {
      transports: ["websocket", "polling"],
      timeout: 10000,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join_event", eventId);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", () => {
      setIsConnected(false);
    });

    socket.on("analytics_update", (message: WebSocketMessage) => {
      switch (message.type) {
        case "guest_added":
          queryClient.invalidateQueries({
            queryKey: eventKeys.details(eventId),
          });
          queryClient.invalidateQueries({
            queryKey: eventKeys.guests(eventId),
          });
          break;

        case "guest_removed":
          queryClient.invalidateQueries({
            queryKey: eventKeys.details(eventId),
          });
          queryClient.invalidateQueries({
            queryKey: eventKeys.guests(eventId),
          });
          break;

        case "event_completed":
          queryClient.setQueryData(
            eventKeys.details(eventId),
            (oldData: unknown) => {
              if (
                oldData &&
                typeof oldData === "object" &&
                "event" in oldData
              ) {
                return {
                  ...oldData,
                  event: {
                    ...(
                      oldData as {
                        event: { status: string; completedAt?: Date };
                      }
                    ).event,
                    status: "COMPLETED",
                    completedAt: new Date(),
                  },
                };
              }
              return oldData;
            }
          );

          toast.info("Event Auto-Completed", {
            description: "The event has automatically ended after 24 hours.",
            duration: 5000,
          });
          break;

        case "guests_reset":
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
                    hourly: data.analytics.hourly.map((h) => ({
                      ...h,
                      count: 0,
                    })),
                  },
                };
              }
              return oldData;
            }
          );
          break;

        case "analytics_update":
          queryClient.invalidateQueries({
            queryKey: eventKeys.details(eventId),
          });
          break;
      }
    });

    socketRef.current = socket;
  }, [eventId, queryClient]);

  useEffect(() => {
    if (eventId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [eventId, connect, disconnect]);

  return {
    isConnected,
  };
};
