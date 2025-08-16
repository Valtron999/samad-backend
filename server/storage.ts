import { 
  type User, type InsertUser,
  type Track, type InsertTrack,
  type Event, type InsertEvent,
  type Ticket, type InsertTicket,
  type MerchProduct, type InsertMerchProduct,
  type MerchOrder, type InsertMerchOrder,
  type GalleryImage, type InsertGalleryImage,
  type SpotifyStats, type TicketTier
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Tracks
  getTracks(): Promise<Track[]>;
  getTrack(id: string): Promise<Track | undefined>;
  createTrack(track: InsertTrack): Promise<Track>;
  updateTrack(id: string, track: Partial<Track>): Promise<Track | undefined>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;

  // Tickets
  getTickets(): Promise<Ticket[]>;
  getTicketsByEvent(eventId: string): Promise<Ticket[]>;
  getTicket(id: string): Promise<Ticket | undefined>;
  getTicketByCode(code: string): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: string, ticket: Partial<Ticket>): Promise<Ticket | undefined>;

  // Merch Products
  getMerchProducts(): Promise<MerchProduct[]>;
  getActiveMerchProducts(): Promise<MerchProduct[]>;
  getMerchProduct(id: string): Promise<MerchProduct | undefined>;
  createMerchProduct(product: InsertMerchProduct): Promise<MerchProduct>;
  updateMerchProduct(id: string, product: Partial<MerchProduct>): Promise<MerchProduct | undefined>;
  deleteMerchProduct(id: string): Promise<boolean>;

  // Merch Orders
  getMerchOrders(): Promise<MerchOrder[]>;
  getMerchOrder(id: string): Promise<MerchOrder | undefined>;
  getMerchOrderByReference(reference: string): Promise<MerchOrder | undefined>;
  createMerchOrder(order: InsertMerchOrder): Promise<MerchOrder>;
  updateMerchOrder(id: string, order: Partial<MerchOrder>): Promise<MerchOrder | undefined>;

  // Gallery
  getGalleryImages(): Promise<GalleryImage[]>;
  getActiveGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImage(id: string): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: string, image: Partial<GalleryImage>): Promise<GalleryImage | undefined>;
  deleteGalleryImage(id: string): Promise<boolean>;

  // Spotify Stats
  getSpotifyStats(): Promise<SpotifyStats | undefined>;
  updateSpotifyStats(stats: Partial<SpotifyStats>): Promise<SpotifyStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private tracks: Map<string, Track> = new Map();
  private events: Map<string, Event> = new Map();
  private tickets: Map<string, Ticket> = new Map();
  private merchProducts: Map<string, MerchProduct> = new Map();
  private merchOrders: Map<string, MerchOrder> = new Map();
  private galleryImages: Map<string, GalleryImage> = new Map();
  private spotifyStats: SpotifyStats | undefined;

  constructor() {
    // Remove or comment out this line to prevent default data:
    // this.seedData();
  }

  // You can also delete or comment out the seedData method:
  // private seedData() {
  //   // Create admin user
  //   const adminId = randomUUID();
  //   this.users.set(adminId, {
  //     id: adminId,
  //     username: "admin",
  //     password: "admin123", // In production, this should be hashed
  //     isAdmin: true,
  //     createdAt: new Date(),
  //   });

  //   // Initial Spotify stats
  //   this.spotifyStats = {
  //     id: randomUUID(),
  //     followers: 15420,
  //     monthlyListeners: 48392,
  //     lastUpdated: new Date(),
  //   };

  //   // Sample event
  //   const eventId = randomUUID();
  //   this.events.set(eventId, {
  //     id: eventId,
  //     title: "Samad Live in Lagos",
  //     description: "An unforgettable night of music and energy",
  //     venue: "Eko Convention Centre",
  //     city: "Lagos",
  //     eventDate: new Date("2024-12-25T20:00:00"),
  //     imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
  //     ticketTiers: [
  //       {
  //         name: "Regular",
  //         price: 2000,
  //         description: ["General admission", "Standing area", "Complimentary drink"],
  //         available: true,
  //       },
  //       {
  //         name: "Platinum",
  //         price: 3000,
  //         description: ["Priority seating", "VIP entrance", "Meet & greet", "Exclusive merchandise"],
  //         available: true,
  //       },
  //       {
  //         name: "VIP",
  //         price: 5000,
  //         description: ["Front row seats", "Backstage access", "Photo opportunity", "Signed merchandise", "Premium drinks"],
  //         available: true,
  //       },
  //     ],
  //     createdAt: new Date(),
  //   });
  // }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: false,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Tracks
  async getTracks(): Promise<Track[]> {
    return Array.from(this.tracks.values());
  }

  async getTrack(id: string): Promise<Track | undefined> {
    return this.tracks.get(id);
  }

  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const id = randomUUID();
    const track: Track = { 
      ...insertTrack, 
      id, 
      createdAt: new Date(),
      spotifyId: insertTrack.spotifyId ?? null,
      spotifyUrl: insertTrack.spotifyUrl ?? null,
      imageUrl: insertTrack.imageUrl ?? null,
      releaseDate: insertTrack.releaseDate ?? null,
      plays: insertTrack.plays ?? null,
      likes: insertTrack.likes ?? null,
    };
    this.tracks.set(id, track);
    return track;
  }

  async updateTrack(id: string, trackUpdate: Partial<Track>): Promise<Track | undefined> {
    const track = this.tracks.get(id);
    if (!track) return undefined;
    
    const updatedTrack = { ...track, ...trackUpdate };
    this.tracks.set(id, updatedTrack);
    return updatedTrack;
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = { 
      ...insertEvent, 
      id, 
      createdAt: new Date(),
      imageUrl: insertEvent.imageUrl ?? null,
      description: insertEvent.description ?? null,
      ticketTiers: Array.isArray(insertEvent.ticketTiers)
        ? insertEvent.ticketTiers as TicketTier[]
        : [],
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, eventUpdate: Partial<Event>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...eventUpdate };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  // Tickets
  async getTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }

  async getTicketsByEvent(eventId: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(ticket => ticket.eventId === eventId);
  }

  async getTicket(id: string): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async getTicketByCode(code: string): Promise<Ticket | undefined> {
    return Array.from(this.tickets.values()).find(ticket => ticket.ticketCode === code);
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = randomUUID();
    const ticketCode = `SAMAD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const ticket: Ticket = { 
      ...insertTicket, 
      id, 
      ticketCode,
      createdAt: new Date(),
      paymentStatus: insertTicket.paymentStatus ?? null,
      paymentReference: insertTicket.paymentReference ?? null,
    };
    this.tickets.set(id, ticket);
    return ticket;
  }

  async updateTicket(id: string, ticketUpdate: Partial<Ticket>): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;
    
    const updatedTicket = { ...ticket, ...ticketUpdate };
    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }

  // Merch Products
  async getMerchProducts(): Promise<MerchProduct[]> {
    return Array.from(this.merchProducts.values());
  }

  async getActiveMerchProducts(): Promise<MerchProduct[]> {
    return Array.from(this.merchProducts.values()).filter(product => product.isActive);
  }

  async getMerchProduct(id: string): Promise<MerchProduct | undefined> {
    return this.merchProducts.get(id);
  }

  async createMerchProduct(insertProduct: InsertMerchProduct): Promise<MerchProduct> {
    const id = randomUUID();
    const product: MerchProduct = { 
      ...insertProduct, 
      id, 
      createdAt: new Date(),
      imageUrl: insertProduct.imageUrl ?? null,
      description: insertProduct.description ?? null,
      stock: insertProduct.stock ?? null,
      isActive: insertProduct.isActive ?? null,
    };
    this.merchProducts.set(id, product);
    return product;
  }

  async updateMerchProduct(id: string, productUpdate: Partial<MerchProduct>): Promise<MerchProduct | undefined> {
    const product = this.merchProducts.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productUpdate };
    this.merchProducts.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteMerchProduct(id: string): Promise<boolean> {
    return this.merchProducts.delete(id);
  }

  // Merch Orders
  async getMerchOrders(): Promise<MerchOrder[]> {
    return Array.from(this.merchOrders.values());
  }

  async getMerchOrder(id: string): Promise<MerchOrder | undefined> {
    return this.merchOrders.get(id);
  }

  async getMerchOrderByReference(reference: string): Promise<MerchOrder | undefined> {
    return Array.from(this.merchOrders.values()).find(order => order.paymentReference === reference);
  }

  async createMerchOrder(insertOrder: InsertMerchOrder): Promise<MerchOrder> {
    const id = randomUUID();
    const trackingNumber = `SAMAD-MERCH-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const order: MerchOrder = { 
      ...insertOrder, 
      id, 
      trackingNumber,
      createdAt: new Date(),
      paymentStatus: insertOrder.paymentStatus ?? null,
      paymentReference: insertOrder.paymentReference ?? null,
      orderStatus: insertOrder.orderStatus ?? null,
    };
    this.merchOrders.set(id, order);
    return order;
  }

  async updateMerchOrder(id: string, orderUpdate: Partial<MerchOrder>): Promise<MerchOrder | undefined> {
    const order = this.merchOrders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...orderUpdate };
    this.merchOrders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Gallery
  async getGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values());
  }

  async getActiveGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values()).filter(image => image.isActive);
  }

  async getGalleryImage(id: string): Promise<GalleryImage | undefined> {
    return this.galleryImages.get(id);
  }

  async createGalleryImage(insertImage: InsertGalleryImage): Promise<GalleryImage> {
    const id = randomUUID();
    const image: GalleryImage = { 
      ...insertImage, 
      id, 
      createdAt: new Date(),
      title: insertImage.title ?? null,
      isActive: insertImage.isActive ?? null,
      caption: insertImage.caption ?? null,
    };
    this.galleryImages.set(id, image);
    return image;
  }

  async updateGalleryImage(id: string, imageUpdate: Partial<GalleryImage>): Promise<GalleryImage | undefined> {
    const image = this.galleryImages.get(id);
    if (!image) return undefined;
    
    const updatedImage = { ...image, ...imageUpdate };
    this.galleryImages.set(id, updatedImage);
    return updatedImage;
  }

  async deleteGalleryImage(id: string): Promise<boolean> {
    return this.galleryImages.delete(id);
  }

  // Spotify Stats
  async getSpotifyStats(): Promise<SpotifyStats | undefined> {
    return this.spotifyStats;
  }

  async updateSpotifyStats(statsUpdate: Partial<SpotifyStats>): Promise<SpotifyStats> {
    if (!this.spotifyStats) {
      const id = randomUUID();
      this.spotifyStats = {
        id,
        followers: 0,
        monthlyListeners: 0,
        lastUpdated: new Date(),
        ...statsUpdate,
      };
    } else {
      this.spotifyStats = {
        ...this.spotifyStats,
        ...statsUpdate,
        lastUpdated: new Date(),
      };
    }
    return this.spotifyStats;
  }
}

export const storage = new MemStorage();
