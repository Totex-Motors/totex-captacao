type SlotApiItem =
  | string
  | {
      time?: string;
      hour?: string;
      startTime?: string;
      start?: string;
      value?: string;
    };

type SlotApiResponse =
  | SlotApiItem[]
  | {
      slots?: SlotApiItem[];
      availableSlots?: SlotApiItem[];
      data?: SlotApiItem[];
    };

function normalizeTime(value: string): string | null {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function extractSlotItems(payload: SlotApiResponse): SlotApiItem[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload?.slots && Array.isArray(payload.slots)) {
    return payload.slots;
  }

  if (payload?.availableSlots && Array.isArray(payload.availableSlots)) {
    return payload.availableSlots;
  }

  if (payload?.data && Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
}

function normalizeSlotItem(item: SlotApiItem): string | null {
  if (typeof item === "string") {
    return normalizeTime(item);
  }

  const value = item.time ?? item.hour ?? item.startTime ?? item.start ?? item.value;

  if (!value) {
    return null;
  }

  return normalizeTime(value);
}

export async function getAvailableSlots(locationId: string, date: string): Promise<string[]> {
  const response = await fetch(
    `/api/inspection/available-slots?locationId=${encodeURIComponent(locationId)}&date=${encodeURIComponent(date)}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const payload = await response.json();

  if (!response.ok) {
    const message =
      typeof payload?.message === "string"
        ? payload.message
        : typeof payload?.error === "string"
          ? payload.error
          : "Erro ao buscar horários disponíveis";

    throw new Error(message);
  }

  const uniqueSlots = new Set(
    extractSlotItems(payload as SlotApiResponse)
      .map(normalizeSlotItem)
      .filter((slot): slot is string => slot !== null)
  );

  return Array.from(uniqueSlots).sort((a, b) => a.localeCompare(b));
}
