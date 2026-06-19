import type { BrokerAdapter, Position, Transaction, Currency } from "../types";

/**
 * Manual entry adapter — positions and transactions entered directly by the user.
 * Reads from local state / Supabase tables.
 */
export class ManualAdapter implements BrokerAdapter {
  private positions: Position[] = [];
  private transactions: Transaction[] = [];

  async connect(): Promise<boolean> {
    return true;
  }

  async getPositions(): Promise<Position[]> {
    return this.positions;
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.transactions;
  }

  async getBalances(): Promise<{ currency: Currency; amount: number }[]> {
    return [{ currency: "GBP", amount: 0 }];
  }

  async disconnect(): Promise<void> {}

  // Mutation methods for manual entry
  addPosition(position: Position): void {
    this.positions.push(position);
  }

  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  removePosition(id: string): void {
    this.positions = this.positions.filter((p) => p.id !== id);
  }
}
