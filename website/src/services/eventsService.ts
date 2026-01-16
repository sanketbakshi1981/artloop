import { API_CONFIG } from '../config/api.config';

export interface Event {
  id?: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  venueAddress: string;
  performer: string;
  performerBio: string;
  description: string;
  fullDescription: string;
  image: string;
  price: string;
  capacity: string;
  dresscode: string;
  includes: string[];
  hostEmail: string;
  isFree?: boolean;
  inviteOnly?: boolean;
  inviteCode?: string;
  status?: string;
  registrationCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Events Service - Handles all event-related API calls
 * Uses Azure Function App API endpoints with Cosmos DB backend
 */
class EventsService {
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
   * Get all events (public endpoint)
   */
  async getAllEvents(filters?: { upcoming?: boolean; status?: string }): Promise<Event[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.upcoming) params.append('upcoming', 'true');
      if (filters?.status) params.append('status', filters.status);

      const url = `${this.baseUrl}/events${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();
      return data.events || data; // Handle both {events: [...]} and [...] responses
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  /**
   * Get a specific event by ID (public endpoint)
   */
  async getEventById(id: string | number): Promise<Event | null> {
    try {
      const response = await fetch(`${this.baseUrl}/events/${id}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch event: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }

  /**
   * Search events by keyword (public endpoint)
   */
  async searchEvents(searchTerm: string): Promise<Event[]> {
    try {
      const url = `${this.baseUrl}/events/search?q=${encodeURIComponent(searchTerm)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to search events: ${response.statusText}`);
      }

      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error searching events:', error);
      throw error;
    }
  }

  /**
   * Create a new event (protected endpoint - requires function key)
   */
  async createEvent(eventData: Event): Promise<Event> {
    try {
      const url = this.functionKey 
        ? `${this.baseUrl}/events?code=${this.functionKey}`
        : `${this.baseUrl}/events`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create event: ${response.statusText}`);
      }

      const data = await response.json();
      return data.event || data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  /**
   * Update an existing event (protected endpoint - requires function key)
   */
  async updateEvent(id: string | number, updates: Partial<Event>): Promise<Event> {
    try {
      const url = this.functionKey 
        ? `${this.baseUrl}/events/${id}?code=${this.functionKey}`
        : `${this.baseUrl}/events/${id}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update event: ${response.statusText}`);
      }

      const data = await response.json();
      return data.event || data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  /**
   * Delete (cancel) an event (protected endpoint - requires function key)
   */
  async deleteEvent(id: string | number): Promise<boolean> {
    try {
      const url = this.functionKey 
        ? `${this.baseUrl}/events/${id}?code=${this.functionKey}`
        : `${this.baseUrl}/events/${id}`;

      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete event: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const eventsService = new EventsService();
