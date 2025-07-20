import "./styles.css";

interface CardProps {
  metrics: string;
  value: string;
}
export function Card({ metrics, value }: CardProps) {
  return (
    <div className="card">
      <div>
        <span className="metrics">{metrics}</span>
        <div className="value">
          <strong>{value}</strong>
        </div>
      </div>
    </div>
  );
}
