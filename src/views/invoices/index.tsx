import { useEffect, useState } from "react";
import { Card } from "../../components/card";
import { DataTableContainer } from "../../components/DataTable/DataTableContainer";
import "./styles.css";
import { MOCK_KPI } from "./mock-kpi";
import type { KPIMetricInterface } from "./types";

export function InvoicePage() {
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetricInterface[]>([]);
  const [loading, setIsLoading] = useState<boolean>(false);

  useEffect(function fetchKPI() {
    async function fetchKPI() {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
      setKpiMetrics(MOCK_KPI);
    }
    fetchKPI();
  }, []);
  return (
    <div>
      <section>
        <header>
          <h2>Collections Dashboard</h2>
        </header>
        <span>Monitor and manage your accounts receivable in real-time</span>
      </section>
      <section className="kpi-container">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={`skeleton-${index}`} loading metrics="" value="" />
            ))
          : kpiMetrics.map((data, index) => (
              <Card
                key={`metric-${index}`}
                metrics={data.metric}
                value={data.value}
              />
            ))}
      </section>
      <section>
        <DataTableContainer />
      </section>
    </div>
  );
}
