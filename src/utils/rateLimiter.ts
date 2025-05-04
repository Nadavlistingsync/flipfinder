export class RateLimiter {
  private lastRequestTime: number = 0;
  private delay: number;

  constructor(delay: number) {
    this.delay = delay;
  }

  async wait(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.delay) {
      await new Promise(resolve => setTimeout(resolve, this.delay - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
  }
} 