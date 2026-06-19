import type { BrokerAdapter, Position, Transaction, Currency } from "../types";

/**
 * IG Index adapter placeholder.
 * IG does not expose a public REST API for retail clients.
 * This adapter is structured to support future integration via:
 *   - IG Labs API (limited access)
 *   - OAuth flow when available
 *   - Screen-scraping fallback (requires Playwright)
 *
 * For now: stub that returns empty data and logs the connection attempt.
 */
export class IGIndexAdapter implements BrokerAdapter {
  private isAuth = false;
  private accountId: string | null = null;

  async connect(credentials?: Record<string, string>): Promise<boolean> {
    if (!credentials?.apiKey || !credentials?.accountId) {
      console.warn("[IGIndexAdapter] No credentials provided. Using stub mode.");
      return false;
    }

    // TODO: POST to https://api.ig.com/gateway/deal/session
    // with { identifier, password, encryptedPassword: false }
    // Store CST and X-SECURITY-TOKEN headers for subsequent calls.
    console.log("[IGIndexAdapter] Connection attempt — stub mode active.");
    this.accountId = credentials.accountId;
    this.isAuth = false; // Will be true once real integration is implemented

    return false;
  }

  async getPositions(): Promise<Position[]> {
    if (!this.isAuth) {
      console.log("[IGIndexAdapter] Not authenticated. Return empty positions.");
      return [];
    }
    // TODO: GET /gateway/deal/positions
    return [];
  }

  async getTransactions(from?: Date, to?: Date): Promise<Transaction[]> {
    if (!this.isAuth) return [];
    // TODO: GET /gateway/deal/history/transactions?from=...&to=...
    void from;
    void to;
    return [];
  }

  async getBalances(): Promise<{ currency: Currency; amount: number }[]> {
    if (!this.isAuth) return [];
    // TODO: GET /gateway/deal/accounts
    return [];
  }

  async disconnect(): Promise<void> {
    // TODO: DELETE /gateway/deal/session
    this.isAuth = false;
    this.accountId = null;
  }
}
