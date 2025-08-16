import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tracks = pgTable("tracks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  spotifyId: text("spotify_id"),
  spotifyUrl: text("spotify_url"),
  imageUrl: text("image_url"),
  releaseDate: text("release_date"),
  plays: integer("plays").default(0),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  venue: text("venue").notNull(),
  city: text("city").notNull(),
  eventDate: timestamp("event_date").notNull(),
  imageUrl: text("image_url"),
  ticketTiers: jsonb("ticket_tiers").$type<TicketTier[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").references(() => events.id).notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  tierName: text("tier_name").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
  totalAmount: integer("total_amount").notNull(),
  paymentStatus: text("payment_status").default("pending"),
  paymentReference: text("payment_reference"),
  ticketCode: text("ticket_code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const merchProducts = pgTable("merch_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  imageUrl: text("image_url"),
  stock: integer("stock").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const merchOrders = pgTable("merch_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => merchProducts.id).notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: jsonb("delivery_address").$type<DeliveryAddress>().notNull(),
  quantity: integer("quantity").notNull(),
  totalAmount: integer("total_amount").notNull(),
  paymentStatus: text("payment_status").default("pending"),
  paymentReference: text("payment_reference"),
  trackingNumber: text("tracking_number"),
  orderStatus: text("order_status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const galleryImages = pgTable("gallery_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title"),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const spotifyStats = pgTable("spotify_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  followers: integer("followers").default(0),
  monthlyListeners: integer("monthly_listeners").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Types
export type TicketTier = {
  name: string;
  price: number;
  description: string[];
  available: boolean;
};

export type DeliveryAddress = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertTrackSchema = createInsertSchema(tracks).omit({ id: true, createdAt: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
export const insertTicketSchema = createInsertSchema(tickets).omit({ id: true, createdAt: true, ticketCode: true });
export const insertMerchProductSchema = createInsertSchema(merchProducts).omit({ id: true, createdAt: true });
export const insertMerchOrderSchema = createInsertSchema(merchOrders).omit({ id: true, createdAt: true, trackingNumber: true });
export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Track = typeof tracks.$inferSelect;
export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type MerchProduct = typeof merchProducts.$inferSelect;
export type InsertMerchProduct = z.infer<typeof insertMerchProductSchema>;
export type MerchOrder = typeof merchOrders.$inferSelect;
export type InsertMerchOrder = z.infer<typeof insertMerchOrderSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type SpotifyStats = typeof spotifyStats.$inferSelect;
