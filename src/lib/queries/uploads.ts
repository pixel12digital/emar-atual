import "server-only";
import { desc, eq } from "drizzle-orm";

import type { UserWithUploads } from "~/app/admin/summary/page.types";

import { db } from "~/db";
import { uploadsTable, userTable } from "~/db/schema";

// Fetch users and their uploads using manual joins
export async function getUsersWithUploads(): Promise<UserWithUploads[]> {
  try {
    if (!db) {
      throw new Error("Database connection not available");
    }

    const users = await db
      .select()
      .from(userTable)
      .leftJoin(uploadsTable, eq(userTable.id, uploadsTable.userId))
      .orderBy(desc(userTable.createdAt));

    // Group uploads by user
    const userMap = new Map<string, UserWithUploads>();

    for (const row of users) {
      const userId = row.user.id;

      if (!userMap.has(userId)) {
        userMap.set(userId, {
          ...row.user,
          uploads: [],
        });
      }

      if (row.uploads) {
        userMap.get(userId)!.uploads.push(row.uploads);
      }
    }

    return [...userMap.values()];
  } catch (error) {
    console.error("Failed to fetch users with uploads:", error);
    return [];
  }
}
