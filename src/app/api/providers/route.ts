import { NextResponse } from "next/server";
import { providers } from "@/lib/mock-data";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: providers,
      total: providers.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
