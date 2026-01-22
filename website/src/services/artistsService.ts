import { API_CONFIG } from '../config/api.config';

export interface Artist {
  id?: string;
  name: string;
  slug?: string;
  profileImage: string;
  talents: string[];
  bio: string;
  fullBio: string;
  location: string;
  rating: number;
  totalReviews: number;
  priceRange: string;
  availability: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
    website?: string;
  };
  featured?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Artists Service - Handles all artist-related API calls
 * Uses Azure Function App API endpoints with Cosmos DB backend
 */
class ArtistsService {
  private baseUrl: string;
  private functionKey?: string;

  constructor() {
    // Use local dev URL if on localhost, otherwise use production
    this.baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:7071/api'
      : `${API_CONFIG.FUNCTION_APP_URL}/api`;
  }

  /**
   * Set function key for protected endpoints (create, update, delete)
   */
  setFunctionKey(key: string) {
    this.functionKey = key;
  }

  /**
   * Get all artists (public endpoint)
   */
  async getAllArtists(filters?: { featured?: boolean; status?: string }): Promise<Artist[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.featured) params.append('featured', 'true');
      if (filters?.status) params.append('status', filters.status);

      const url = `${this.baseUrl}/artists${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch artists: ${response.statusText}`);
      }

      const data = await response.json();
      return data.artists || data;
    } catch (error) {
      console.error('Error fetching artists:', error);
      throw error;
    }
  }

  /**
   * Get a specific artist by ID (public endpoint)
   */
  async getArtistById(id: string | number): Promise<Artist | null> {
    try {
      const response = await fetch(`${this.baseUrl}/artists/${id}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch artist: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching artist:', error);
      throw error;
    }
  }

  /**
   * Search artists by keyword (public endpoint)
   */
  async searchArtists(searchTerm: string): Promise<Artist[]> {
    try {
      const url = `${this.baseUrl}/artists/search?q=${encodeURIComponent(searchTerm)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to search artists: ${response.statusText}`);
      }

      const data = await response.json();
      return data.artists || [];
    } catch (error) {
      console.error('Error searching artists:', error);
      throw error;
    }
  }

  /**
   * Create a new artist (protected endpoint - requires function key)
   */
  async createArtist(artistData: Artist): Promise<Artist> {
    try {
      const url = this.functionKey 
        ? `${this.baseUrl}/artists?code=${this.functionKey}`
        : `${this.baseUrl}/artists`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artistData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create artist: ${response.statusText}`);
      }

      const data = await response.json();
      return data.artist || data;
    } catch (error) {
      console.error('Error creating artist:', error);
      throw error;
    }
  }

  /**
   * Update an existing artist (protected endpoint - requires function key)
   */
  async updateArtist(id: string | number, updates: Partial<Artist>): Promise<Artist> {
    try {
      const url = this.functionKey 
        ? `${this.baseUrl}/artists/${id}?code=${this.functionKey}`
        : `${this.baseUrl}/artists/${id}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update artist: ${response.statusText}`);
      }

      const data = await response.json();
      return data.artist || data;
    } catch (error) {
      console.error('Error updating artist:', error);
      throw error;
    }
  }

  /**
   * Delete an artist (protected endpoint - requires function key)
   */
  async deleteArtist(id: string | number): Promise<boolean> {
    try {
      const url = this.functionKey 
        ? `${this.baseUrl}/artists/${id}?code=${this.functionKey}`
        : `${this.baseUrl}/artists/${id}`;

      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete artist: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting artist:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const artistsService = new ArtistsService();
