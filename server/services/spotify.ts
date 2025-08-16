interface SpotifyArtist {
  followers: {
    total: number;
  };
  popularity: number;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
}

interface SpotifyTrack {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
  album: {
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
    release_date: string;
  };
  popularity: number;
}

class SpotifyService {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID || "";
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET || "";
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new Error("Spotify credentials not configured");
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error("Failed to get Spotify access token");
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 minute early

    return this.accessToken!;
  }

  async searchArtist(artistName: string): Promise<SpotifyArtist | null> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search artist");
      }

      const data = await response.json();
      return data.artists.items[0] || null;
    } catch (error) {
      console.error("Spotify artist search error:", error);
      return null;
    }
  }

  async getArtistTopTracks(artistId: string, market: string = "NG"): Promise<SpotifyTrack[]> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${market}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get artist top tracks");
      }

      const data = await response.json();
      return data.tracks || [];
    } catch (error) {
      console.error("Spotify top tracks error:", error);
      return [];
    }
  }

  async getArtistStats(artistName: string) {
    try {
      const artist = await this.searchArtist(artistName);
      if (!artist) {
        return {
          followers: 0,
          monthlyListeners: 0,
          popularity: 0,
        };
      }

      return {
        followers: artist.followers.total,
        monthlyListeners: Math.floor(artist.followers.total * 1.5), // Approximate monthly listeners
        popularity: artist.popularity,
      };
    } catch (error) {
      console.error("Error getting artist stats:", error);
      return {
        followers: 0,
        monthlyListeners: 0,
        popularity: 0,
      };
    }
  }

  async getArtistStatsById(artistId: string) {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get artist stats");
      }

      const artist = await response.json();
      return {
        followers: artist.followers.total,
        monthlyListeners: Math.floor(artist.followers.total * 1.5), // Approximate monthly listeners  
        popularity: artist.popularity,
      };
    } catch (error) {
      console.error("Error getting artist stats by ID:", error);
      return {
        followers: 0,
        monthlyListeners: 0,
        popularity: 0,
      };
    }
  }

  generateStreamingUrls(artistName: string, trackName: string) {
    const query = `${artistName} ${trackName}`;
    const encodedQuery = encodeURIComponent(query);

    return {
      spotify: `https://open.spotify.com/search/${encodedQuery}`,
      appleMusic: `https://music.apple.com/search?term=${encodedQuery}`,
      youtubeMusic: `https://music.youtube.com/search?q=${encodedQuery}`,
      soundcloud: `https://soundcloud.com/search?q=${encodedQuery}`,
    };
  }
}

export const spotifyService = new SpotifyService();
