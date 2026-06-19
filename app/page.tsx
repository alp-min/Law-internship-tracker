"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PortfolioValueCard } from "@/components/dashboard/PortfolioValueCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { AllocationChart } from "@/components/dashboard/AllocationChart";
import { MarketSnapshot } from "@/components/dashboard/MarketSnapshot";
import { TopMovers } from "@/components/dashboard/TopMovers";
import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { InsightCards } from "@/components/dashboard/InsightCards";
import { WatchlistWidget } from "@/components/dashboard/WatchlistWidget";

import {
  mockPortfolioSummary,
  mockPerformanceHistory,
  mockSectorAllocation,
  mockGeographyAllocation,
  mockAssetClassAllocation,
  mockMarketIndices,
  mockTopMovers,
  mockNews,
  mockTransactions,
  mockInsights,
  mockWatchlists,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const [loaded, setLoaded] = useState(false);

  const watchlistItems = mockWatchlists[0].items;

  return (
    <>
      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {loaded && (
        <AppShell
          title="Dashboard"
          subtitle={`${mockPortfolioSummary.positions.filter(p => p.assetClass !== "cash").length} positions · last updated just now`}
        >
          <div className="p-5 space-y-5 max-w-[1600px] mx-auto">
            {/* Row 1: Value + Quick stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <PortfolioValueCard summary={mockPortfolioSummary} />
              <MarketSnapshot indices={mockMarketIndices.slice(0, 4)} />
            </div>

            {/* Row 2: Performance chart */}
            <div className="grid grid-cols-1 gap-4">
              <PerformanceChart data={mockPerformanceHistory} />
            </div>

            {/* Row 3: Allocation + Top Movers + Watchlist */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AllocationChart
                sector={mockSectorAllocation}
                geography={mockGeographyAllocation}
                assetClass={mockAssetClassAllocation}
              />
              <TopMovers movers={mockTopMovers} />
              <div className="lg:col-span-2">
                <WatchlistWidget items={watchlistItems} />
              </div>
            </div>

            {/* Row 4: News + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <NewsFeed news={mockNews} />
              <RecentActivity transactions={mockTransactions} />
            </div>

            {/* Row 5: Insights */}
            <InsightCards insights={mockInsights} />
          </div>
        </AppShell>
      )}
    </>
  );
}
