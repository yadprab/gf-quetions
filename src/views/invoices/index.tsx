import { Card } from "../../components/card";
import { DataTableContainer } from "../../components/DataTable/DataTableContainer";
import "./styles.css";
export function InvoicePage() {
  return (
    <div>
      <section>
        <header>
          <h2>Collections Dashboard</h2>
        </header>
        <span>Monitor and manage your accounts receivable in real-time</span>
      </section>
      <section className="kpi-container">
        <Card metrics="Total Outstanding" value="$486,250" />
        <Card metrics="Collections Rate" value="87.3%" />
        <Card metrics="Active Customers" value="1,247" />
        <Card metrics="Avg. Days to Pay" value="32 days" />
      </section>
      <section>
        <DataTableContainer />
      </section>
    </div>
  );
}
