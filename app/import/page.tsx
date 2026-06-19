"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Plug, CheckCircle, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const BROKERS = [
  { id: "ig", name: "IG Index", logo: "🏦", status: "placeholder", description: "API integration in development. CSV export available now." },
  { id: "manual", name: "Manual Entry", logo: "✏️", status: "active", description: "Add positions and transactions by hand." },
  { id: "csv", name: "CSV Import", logo: "📄", status: "active", description: "Import from any broker using our CSV template." },
  { id: "ib", name: "Interactive Brokers", logo: "🌐", status: "coming", description: "IBKR API integration — coming soon." },
  { id: "hl", name: "Hargreaves Lansdown", logo: "🇬🇧", status: "coming", description: "HL integration — coming soon." },
];

const STATUS_CONFIG = {
  active: { label: "Active", variant: "gain" as const },
  placeholder: { label: "Placeholder", variant: "warn" as const },
  coming: { label: "Coming Soon", variant: "default" as const },
};

export default function ImportPage() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.name.endsWith(".csv")) setFile(f);
  }

  return (
    <AppShell title="Import Data" subtitle="Connect brokers and import portfolio data">
      <div className="p-5 max-w-[1000px] mx-auto space-y-6">
        {/* Broker connections */}
        <div>
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4">Broker Connections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BROKERS.map((broker, i) => {
              const cfg = STATUS_CONFIG[broker.status as keyof typeof STATUS_CONFIG];
              return (
                <motion.div
                  key={broker.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-surface border border-border rounded-xl p-4 flex items-start gap-4 hover:border-border-subtle transition-all"
                >
                  <span className="text-2xl shrink-0">{broker.logo}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-primary">{broker.name}</p>
                      <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                    </div>
                    <p className="text-xs text-muted">{broker.description}</p>
                  </div>
                  <Button
                    variant={broker.status === "active" ? "secondary" : "ghost"}
                    size="sm"
                    disabled={broker.status === "coming"}
                    icon={broker.status === "active" ? <Plug /> : undefined}
                  >
                    {broker.status === "active" ? "Connect" : broker.status === "coming" ? "Soon" : "Setup"}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CSV upload */}
        <Card delay={0.3}>
          <CardHeader>
            <CardTitle>CSV Import</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <p className="text-xs text-muted">
              Upload a CSV file with columns: <span className="font-mono text-accent">ticker, name, quantity, avg_cost, current_price, currency</span>
            </p>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                dragging
                  ? "border-accent bg-accent-glow"
                  : file
                  ? "border-gain bg-gain-dim"
                  : "border-border hover:border-border-subtle hover:bg-surface-2"
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <CheckCircle className="w-10 h-10 text-gain" />
                  <p className="text-sm font-medium text-primary">{file.name}</p>
                  <p className="text-xs text-muted">{(file.size / 1024).toFixed(1)} KB</p>
                  <Button variant="primary" size="sm">Process Import</Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-10 h-10 text-muted" />
                  <div>
                    <p className="text-sm font-medium text-primary">Drop CSV file here</p>
                    <p className="text-xs text-muted mt-1">or click to browse</p>
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload">
                    <Button variant="secondary" size="sm" icon={<FileText />} className="cursor-pointer">
                      Browse file
                    </Button>
                  </label>
                </div>
              )}
            </div>

            {/* Template download */}
            <div className="flex items-center gap-2 p-3 bg-surface-2 rounded-lg border border-border">
              <AlertCircle className="w-4 h-4 text-accent shrink-0" />
              <p className="text-xs text-muted flex-1">
                Not sure of the format? Download the CSV template.
              </p>
              <Button variant="ghost" size="sm">
                Download template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
