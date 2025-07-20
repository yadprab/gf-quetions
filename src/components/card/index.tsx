import "./styles.css";

interface CardProps {
  metrics: string;
  value: string;
  loading?: boolean;
}

export function Card({ metrics, value, loading = false }: CardProps) {
  return (
    <div className="card">
      <div>
        {loading ? (
          <>
            <span className="skeleton skeleton-metrics" />
            <div className="value">
              <div className="skeleton skeleton-value" />
            </div>
          </>
        ) : (
          <>
            <span className="metrics">{metrics}</span>
            <div className="value">
              <strong>{value}</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
