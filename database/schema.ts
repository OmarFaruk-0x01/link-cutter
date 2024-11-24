import { relations } from "drizzle-orm";
import {
  integer,
  json,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  links: many(links),
}));

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  shortCode: varchar("short_code", { length: 255 }).notNull().unique(),
  link: varchar("link").notNull(),
  metadata: json("metadata"),
  userId: integer("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const linksRelations = relations(links, ({ one }) => ({
  user: one(users, {
    fields: [links.userId],
    references: [users.id],
  }),
}));
