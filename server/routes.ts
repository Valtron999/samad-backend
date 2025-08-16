import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { SpotifyStats } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

export async function registerRoutes(app: Express, spotifyService: any): Promise<Server> {
  // Events
  app.get("/api/events", async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.post("/api/events", async (req, res) => {
    try {
      const event = await storage.createEvent({
        ...req.body,
        ticketLink: req.body.ticketLink || null,
      });
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  // Merch
  app.get("/api/merch", async (req, res) => {
    const products = await storage.getMerchProducts();
    res.json(products);
  });

  app.post("/api/merch", upload.single("image"), async (req, res) => {
    try {
      const product = await storage.createMerchProduct({
        ...req.body,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        jumiaLink: req.body.jumiaLink || null,
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.get("/api/spotify/tracks", async (req, res) => {
    // Replace with your artist name or ID
    const artistName = "Samad";
    const artist = await spotifyService.searchArtist(artistName);
    if (!artist) return res.json([]);
    const tracks = await spotifyService.getArtistTopTracks(artist.id, "NG");
    res.json(tracks);
  });

  app.get("/api/spotify/stats", async (req, res) => {
    const artistName = "Samad";
    const stats = await spotifyService.getArtistStats(artistName);
    res.json(stats);
  });

  // Gallery and Spotify stats endpoints remain unchanged
  // Remove all ticket/payment endpoints
  return createServer(app);
}
