import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { API_CONFIG } from "./config";
import {
  AnalyticsData,
  CreateEventRequest,
  CreateGuestRequest,
  Event,
  Guest,
} from "./types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface ApiError {
  success: false;
  message: string;
  statusCode: number;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError<ApiError>) => {
        return Promise.reject(error);
      }
    );
  }

  async createEvent(data: CreateEventRequest): Promise<Event> {
    const response = await this.client.post<ApiResponse<Event>>(
      "/events",
      data
    );
    return response.data.data;
  }

  async getEventDetails(
    eventId: string
  ): Promise<{ event: Event; analytics: AnalyticsData }> {
    const response = await this.client.get<
      ApiResponse<{ event: Event; analytics: AnalyticsData }>
    >(`/events/${eventId}`);
    return response.data.data;
  }

  async completeEvent(eventId: string): Promise<{
    id: string;
    name: string;
    startedAt: string;
    completedAt: string;
    duration: string;
    totalGuests: number;
    maleGuests: number;
    femaleGuests: number;
  }> {
    const response = await this.client.patch<
      ApiResponse<{
        id: string;
        name: string;
        startedAt: string;
        completedAt: string;
        duration: string;
        totalGuests: number;
        maleGuests: number;
        femaleGuests: number;
      }>
    >(`/events/${eventId}/complete`);
    return response.data.data;
  }

  async resetGuests(eventId: string): Promise<{ message: string }> {
    const response = await this.client.post<ApiResponse<{ message: string }>>(
      `/events/${eventId}/reset`
    );
    return response.data.data;
  }

  async exportEventCSV(eventId: string): Promise<Blob> {
    const response = await this.client.get(`/events/${eventId}/export`, {
      responseType: "blob",
    });
    return response.data;
  }

  async getGuests(eventId: string): Promise<Guest[]> {
    const response = await this.client.get<ApiResponse<Guest[]>>(
      `/events/${eventId}/guests`
    );
    return response.data.data;
  }

  async createGuest(eventId: string, data: CreateGuestRequest): Promise<Guest> {
    const response = await this.client.post<ApiResponse<Guest>>(
      `/events/${eventId}/guests`,
      data
    );
    return response.data.data;
  }

  async deleteGuest(
    eventId: string,
    guestId: string
  ): Promise<{ message: string }> {
    const response = await this.client.delete<ApiResponse<{ message: string }>>(
      `/events/${eventId}/guests/${guestId}`
    );
    return response.data.data;
  }

  async healthCheck(): Promise<{
    success: boolean;
    message: string;
    timestamp: string;
  }> {
    const response = await this.client.get<{
      success: boolean;
      message: string;
      timestamp: string;
    }>("/health");
    return response.data;
  }
}

export const apiClient = new ApiClient();

export const handleApiError = (error: AxiosError<ApiError>): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export const isApiError = (error: unknown): error is AxiosError<ApiError> => {
  return (
    error !== null &&
    typeof error === "object" &&
    "isAxiosError" in error &&
    error.isAxiosError === true
  );
};
