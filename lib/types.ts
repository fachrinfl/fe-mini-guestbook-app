export enum EventStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface Event {
  id: string;
  name: string;
  startedAt: Date;
  completedAt?: Date;
  status: EventStatus;
  guests: Guest[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  gender: Gender;
  createdAt: Date;
}

export interface EventSummary {
  total: number;
  male: number;
  female: number;
  duration: string;
}

export interface HourlyAnalytics {
  hour: string;
  count: number;
}

export interface AnalyticsData {
  total: number;
  male: number;
  female: number;
  hourly: HourlyAnalytics[];
}

export interface CreateEventRequest {
  name: string;
}

export interface CreateGuestRequest {
  name: string;
  gender: Gender;
}
