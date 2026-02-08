import { GeminiCacheEntry } from "@/types/ai";

/**
 * Simple in-memory cache for Gemini API responses
 * Helps reduce API calls and stay within free tier quota
 */
class GeminiCache {
  private cache: Map<string, GeminiCacheEntry> = new Map();
  private readonly DEFAULT_TTL = 1000 * 60 * 60; // 1 hour

  /**
   * Generate cache key from prompt
   */
  private generateKey(prompt: string): string {
    // Simple hash function for cache key
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `gemini_${hash}`;
  }

  /**
   * Get cached response if available and not expired
   */
  get(prompt: string): string | null {
    const key = this.generateKey(prompt);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.response;
  }

  /**
   * Store response in cache
   */
  set(prompt: string, response: string, ttl: number = this.DEFAULT_TTL): void {
    const key = this.generateKey(prompt);
    const entry: GeminiCacheEntry = {
      key,
      response,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    };

    this.cache.set(key, entry);
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.values()).map((entry) => ({
        key: entry.key,
        timestamp: new Date(entry.timestamp).toISOString(),
        expiresAt: new Date(entry.expiresAt).toISOString(),
      })),
    };
  }
}

// Singleton instance
const geminiCache = new GeminiCache();

// Cleanup expired entries every 10 minutes
if (typeof window !== "undefined") {
  setInterval(
    () => {
      geminiCache.cleanup();
    },
    1000 * 60 * 10
  );
}

export default geminiCache;
