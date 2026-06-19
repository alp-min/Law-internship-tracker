import type { BrokerAdapter, Position, Transaction, Currency } from "../types";

export interface CSVRow {
  [key: string]: string;
}

/**
 * CSV adapter — parses exported broker CSV files (IG Index format + generic).
 * Expected columns: ticker, name, quantity, avg_cost, current_price, currency
 */
export class CSVAdapter implements BrokerAdapter {
  private rawCSV: string = "";
  private positions: Position[] = [];

  async connect(credentials?: Record<string, string>): Promise<boolean> {
    if (credentials?.csvContent) {
      this.rawCSV = credentials.csvContent;
      await this.parse();
    }
    return true;
  }

  private async parse(): Promise<void> {
    // Dynamic import to keep papaparse out of the critical bundle
    const Papa = (await import("papaparse")).default;

    const result = Papa.parse<CSVRow>(this.rawCSV, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, "_"),
    });

    this.positions = result.data
      .filter((row) => row.ticker || row.symbol || row.epic)
      .map((row, i) => {
        const ticker = (row.ticker || row.symbol || row.epic || "").toUpperCase();
        const qty = parseFloat(row.quantity || row.qty || row.shares || "0");
        const cost = parseFloat(row.avg_cost || row.average_cost || row.cost_per_share || "0");
        const price = parseFloat(row.current_price || row.last_price || row.price || cost.toString());
        const currency = ((row.currency || "GBP") as Currency);
        const marketValue = qty * price;

        return {
          id: `csv-${i}`,
          ticker,
          name: row.name || row.description || ticker,
          assetClass: "stock" as const,
          sector: "Technology" as const,
          geography: "United States" as const,
          exchange: "OTHER" as const,
          currency,
          quantity: qty,
          avgCostBasis: cost,
          currentPrice: price,
          previousClose: price,
          marketValue,
          unrealisedPL: (price - cost) * qty,
          unrealisedPLPct: cost > 0 ? ((price - cost) / cost) * 100 : 0,
          dayChange: 0,
          dayChangePct: 0,
          weight: 0,
          addedDate: new Date().toISOString().split("T")[0],
        } satisfies Position;
      });
  }

  async getPositions(): Promise<Position[]> {
    return this.positions;
  }

  async getTransactions(): Promise<Transaction[]> {
    return [];
  }

  async getBalances(): Promise<{ currency: Currency; amount: number }[]> {
    return [{ currency: "GBP", amount: 0 }];
  }

  async disconnect(): Promise<void> {
    this.rawCSV = "";
    this.positions = [];
  }
}
