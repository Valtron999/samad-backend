import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { SpotifyStats } from "../shared/schema";
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
      const file = (req as typeof req & { file?: any }).file;
      const product = await storage.createMerchProduct({
        ...req.body,
        imageUrl: file ? `/uploads/${file.filename}` : null,
        jumiaLink: req.body.jumiaLink || null,
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  // Spotify: Top Tracks
  app.get("/api/spotify/tracks", async (req, res) => {
    const artistName = "Samad";
    const artist = await spotifyService.searchArtist(artistName);
    if (!artist) return res.json([]);
    const tracks = await spotifyService.getArtistTopTracks(artist.id, "NG");
    res.json(tracks);
  });

  // Spotify: Stats
  app.get("/api/spotify/stats", async (req, res) => {
    const artistName = "Samad";
    const stats = await spotifyService.getArtistStats(artistName);
    res.json(stats);
  });

  // ✅ New: Generate streaming URLs for a track
  app.post("/api/spotify/streaming-urls", async (req, res) => {
    try {
      const { trackName } = req.body;
      if (!trackName) {
        return res.status(400).json({ error: "trackName is required" });
      }

      // Find artist first
      const artistName = "Samad"; // adjust if needed
      const artist = await spotifyService.searchArtist(artistName);
      if (!artist) {
        return res.status(404).json({ error: "Artist not found" });
      }

      // Try to find the track on Spotify
      const track = await spotifyService.searchTrack(trackName, artist.id);
      const spotifyUrl = track ? track.external_urls.spotify : null;

      // Encode for search fallback
      const encodedName = encodeURIComponent(`${artistName} ${trackName}`);

      const urls = {
        spotify: spotifyUrl || `https://open.spotify.com/search/${encodedName}`,
        appleMusic: `https://music.apple.com/search?term=${encodedName}`,
        youtubeMusic: `https://music.youtube.com/search?q=${encodedName}`,
        soundcloud: `https://soundcloud.com/search?q=${encodedName}`,
        audiomack: `https://audiomack.com/search/${encodedName}`,
        boomplay: `https://www.boomplay.com/search/${encodedName}`,
        deezer: `https://www.deezer.com/search/${encodedName}`,
        tidal: `https://listen.tidal.com/search/${encodedName}`,
        spinlet: null, // service mostly inactive
        naijaloaded: `https://www.naijaloaded.com.ng/search?q=${encodedName}`,
      };

      res.json(urls);
    } catch (error) {
      console.error("Error generating streaming URLs:", error);
      res.status(500).json({ error: "Failed to generate streaming URLs" });
    }
  });

  return createServer(app);
}
