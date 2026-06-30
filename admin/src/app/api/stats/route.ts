import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDashboardStats } from "@/lib/stats";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getDashboardStats();
  return NextResponse.json(stats);
}
