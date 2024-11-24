import { and, desc, eq } from "drizzle-orm";
import e from "express";
import { useId } from "react";
import { z } from "zod";
import { database } from "~/database/context";
import { links as linksTable } from "~/database/schema";

export const linkSchema = z.object({
  url: z.string().url(),
});

export type LinkModel = typeof linksTable.$inferSelect;
export type CreateLinkData = z.infer<typeof linkSchema>;

export const getLinksByUser = async (userId: number): Promise<LinkModel[]> => {
  const db = database();

  const links = await db.query.links.findMany({
    where: eq(linksTable.userId, userId),
    orderBy: [desc(linksTable.createdAt)],
  });

  return links;
};

export const getLinkByShortCode = async (
  shortCode: string,
): Promise<LinkModel | null> => {
  const db = database();

  const link =
    (await db.query.links.findFirst({
      where: eq(linksTable.shortCode, shortCode),
    })) ?? null;

  return link;
};

export const createLinkByUser = async (
  userId: number,
  linkData: CreateLinkData,
): Promise<LinkModel | null> => {
  const db = database();

  const shortCode = (Math.random() + 1).toString(36).substring(7);

  try {
    await db.insert(linksTable).values({
      userId,
      shortCode,
      link: linkData.url,
    });
  } catch (err) {}

  const link =
    (await db.query.links.findFirst({
      where: and(
        eq(linksTable.shortCode, shortCode),
        eq(linksTable.userId, userId),
      ),
    })) ?? null;

  return link;
};

export const removeByShortCode = async (code: string): Promise<boolean> => {
  const db = database();

  const link = await getLinkByShortCode(code);

  try {
    await db.delete(linksTable).where(eq(linksTable.id, link?.id!));
    return true;
  } catch (err) {
    return false;
  }
};
