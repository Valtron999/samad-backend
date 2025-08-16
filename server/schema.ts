import { z } from "zod";

export const insertEventSchema = z.object({
  title: z.string(),
  eventDate: z.string(),
  venue: z.string(),
  city: z.string(),
  // add other fields as needed
});

export const insertTicketSchema = z.object({
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  eventId: z.string(),
  totalAmount: z.number(),
  price: z.number(),        // Add this
  tierName: z.string(),     // Add this
  quantity: z.number(),     // Add this
});

export const insertMerchProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  stock: z.number(),
  imageUrl: z.string().nullable(),
  // add other fields as needed
});

export const insertMerchOrderSchema = z.object({
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  productId: z.string(),
  totalAmount: z.number(),
  quantity: z.number(), // <-- Add this
  deliveryAddress: z.object({ // <-- Add this
    city: z.string(),
    street: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
});

export const insertGalleryImageSchema = z.object({
  title: z.string(),
  imageUrl: z.string(),
  caption: z.string(),
  // add other fields as needed
});