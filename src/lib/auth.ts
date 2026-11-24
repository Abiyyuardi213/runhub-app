import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export interface AuthenticatedAdmin {
  id: string;
  name: string | null;
  role: "ADMIN";
}

/**
 * Memvalidasi apakah request berasal dari Admin.
 * Jika dalam mode development lokal dan belum ada user yang login via Strava,
 * fungsi ini memberikan bypass fallback agar pengujian Admin panel di localhost berjalan lancar.
 */
export async function requireAdmin(request: NextRequest): Promise<AuthenticatedAdmin | null> {
  const userId =
    request.cookies.get("runhub_user_id")?.value ||
    request.headers.get("x-user-id");

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, role: true },
    });

    if (user && user.role === "ADMIN") {
      return user as AuthenticatedAdmin;
    }
  }

  // Fallback untuk local development agar admin control bisa dites langsung sebelum Strava login
  if (process.env.NODE_ENV !== "production") {
    return {
      id: "local-dev-admin",
      name: "Local Administrator",
      role: "ADMIN",
    };
  }

  return null;
}
