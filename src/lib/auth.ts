import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export interface AuthenticatedAdmin {
  id: string;
  name: string | null;
  role: "ADMIN";
}

/**
 * Memvalidasi apakah request berasal dari Admin.
 * Memeriksa cookie session atau header otentikasi.
 */
export async function requireAdmin(request: NextRequest): Promise<AuthenticatedAdmin | null> {
  const userId =
    request.cookies.get("runhub_user_id")?.value ||
    request.headers.get("x-user-id");

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return user as AuthenticatedAdmin;
}
