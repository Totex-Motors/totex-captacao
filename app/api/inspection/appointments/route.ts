import { NextRequest, NextResponse } from "next/server";

const INSPECTION_APPOINTMENTS_URL = "https://totexmotors.com/api/inspection/appointments";

type AppointmentPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleVersion: string;
  vehicleYear: number;
  locationId: string;
  scheduledDate: string;
  scheduledTime: string;
};

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<AppointmentPayload>;

    const customerName = body.customerName?.trim();
    const customerEmail = body.customerEmail?.trim();
    const customerPhone = body.customerPhone ? normalizePhone(body.customerPhone) : "";
    const vehicleBrand = body.vehicleBrand?.trim();
    const vehicleModel = body.vehicleModel?.trim();
    const vehicleVersion = body.vehicleVersion?.trim();
    const vehicleYear = Number(body.vehicleYear);
    const locationId = body.locationId?.trim();
    const scheduledDate = body.scheduledDate?.trim();
    const scheduledTime = body.scheduledTime?.trim();

    const missingFields = [
      !customerName && "customerName",
      !customerEmail && "customerEmail",
      !customerPhone && "customerPhone",
      !vehicleBrand && "vehicleBrand",
      !vehicleModel && "vehicleModel",
      !vehicleVersion && "vehicleVersion",
      !Number.isFinite(vehicleYear) && "vehicleYear",
      !locationId && "locationId",
      !scheduledDate && "scheduledDate",
      !scheduledTime && "scheduledTime",
    ].filter(Boolean);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Campos obrigatorios ausentes: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    if (!customerEmail || !isEmail(customerEmail)) {
      return NextResponse.json(
        { success: false, message: "Email invalido" },
        { status: 400 }
      );
    }

    if (!scheduledDate || !isIsoDate(scheduledDate)) {
      return NextResponse.json(
        { success: false, message: "Data agendada invalida" },
        { status: 400 }
      );
    }

    if (!scheduledTime || !isTime(scheduledTime)) {
      return NextResponse.json(
        { success: false, message: "Horario agendado invalido" },
        { status: 400 }
      );
    }

    const payload: AppointmentPayload = {
      customerName: customerName as string,
      customerEmail: customerEmail as string,
      customerPhone,
      vehicleBrand: vehicleBrand as string,
      vehicleModel: vehicleModel as string,
      vehicleVersion: vehicleVersion as string,
      vehicleYear,
      locationId: locationId as string,
      scheduledDate: scheduledDate as string,
      scheduledTime: scheduledTime as string,
    };

    const response = await fetch(INSPECTION_APPOINTMENTS_URL, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        typeof data?.message === "string"
          ? data.message
          : typeof data?.error === "string"
            ? data.error
            : "Erro ao criar agendamento";

      return NextResponse.json(
        { success: false, message, details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno ao criar agendamento" },
      { status: 500 }
    );
  }
}
