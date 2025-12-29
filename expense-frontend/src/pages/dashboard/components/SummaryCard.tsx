import { type SummaryMetric } from "../dashboard.types";

interface Props {
  metric: SummaryMetric;
}

const SummaryCard = ({ metric }: Props) => {
  return (
    <div className="card h-100 shadow-sm card-hover border-0">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-muted small mb-1">{metric.title}</p>
            <h4 className="fw-bold mb-0" style={{ color: metric.color || 'inherit' }}>
              {metric.value}
            </h4>
            {metric.trend !== undefined && (
              <div className="d-flex align-items-center gap-1 mt-2">
                <span
                  className="small fw-semibold"
                  style={{ color: metric.positive ? '#22c55e' : '#ef4444' }}
                >
                  {metric.positive ? '+' : '-'}{metric.trend}%
                </span>
                <span className="text-muted" style={{ fontSize: '12px' }}>
                  vs last month
                </span>
              </div>
            )}
          </div>
          {metric.icon && (
            <div
              className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
              style={{
                width: '44px',
                height: '44px',
                backgroundColor: `${metric.color}15`,
                color: metric.color,
              }}
            >
              <i className={`bi ${metric.icon} fs-4`}></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
