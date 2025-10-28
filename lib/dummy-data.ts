import { AnalyticsData, Event, EventStatus, Gender, Guest } from "./types";

const generateDummyGuests = (eventId: string, count: number): Guest[] => {
  const names = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "David Brown",
    "Lisa Davis",
    "Chris Miller",
    "Emma Garcia",
    "Alex Rodriguez",
    "Maria Martinez",
    "James Anderson",
    "Jennifer Taylor",
    "Robert Thomas",
    "Linda Jackson",
    "William White",
    "Patricia Harris",
    "Michael Martin",
    "Barbara Thompson",
    "Richard Garcia",
    "Elizabeth Martinez",
  ];

  const genders: Gender[] = [Gender.MALE, Gender.FEMALE];

  return Array.from({ length: count }, (_, i) => ({
    id: `guest-${i + 1}`,
    eventId,
    name: names[i % names.length],
    gender: genders[Math.floor(Math.random() * genders.length)],
    createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
  }));
};

const generateHourlyAnalytics = (): AnalyticsData => {
  const now = new Date();
  const hourly = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now);
    hour.setHours(i, 0, 0, 0);
    return {
      hour: hour.toISOString(),
      count: Math.floor(Math.random() * 10),
    };
  });

  const total = hourly.reduce((sum, h) => sum + h.count, 0);
  const male = Math.floor(total * 0.6);
  const female = total - male;

  return {
    total,
    male,
    female,
    hourly,
  };
};

export const sampleEvents: Event[] = [
  {
    id: "event-1",
    name: "Tech Conference 2024",
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: undefined,
    status: EventStatus.ACTIVE,
    guests: generateDummyGuests("event-1", 25),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "event-2",
    name: "Wedding Reception",
    startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    status: EventStatus.COMPLETED,
    guests: generateDummyGuests("event-2", 50),
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "event-3",
    name: "Company Annual Meeting",
    startedAt: new Date(Date.now() - 30 * 60 * 1000),
    completedAt: undefined,
    status: EventStatus.ACTIVE,
    guests: generateDummyGuests("event-3", 12),
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(),
  },
];

export const sampleAnalytics: Record<string, AnalyticsData> = {
  "event-1": generateHourlyAnalytics(),
  "event-2": generateHourlyAnalytics(),
  "event-3": generateHourlyAnalytics(),
};

export const getEventById = (id: string): Event | undefined => {
  return sampleEvents.find((event) => event.id === id);
};

export const getAnalyticsById = (id: string): AnalyticsData | undefined => {
  return sampleAnalytics[id];
};
