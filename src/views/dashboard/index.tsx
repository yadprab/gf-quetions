import { useState, useEffect } from "react";
import { fetchRecentActivity, fetchStats } from "../../services/apiService";

import StatCard from "../../components/stat_card";
import ActivityItem, {
  type ActivityType,
} from "../../components/activity_item";
import ActionItem from "../../components/action_item";
import useStore from "../../store/useStore";

import {
  RiMoneyDollarCircleLine,
  RiUser3Line,
  RiTimeLine,
  RiPulseLine,
  RiAlertLine,
  RiLineChartLine,
} from "react-icons/ri";
import {
  CARD_MOCK_DATA,
  PRIORITY_ACTION_MOCK_DATA,
  RECENT_ACTIVITY_MOCK_DATA,
} from "../../mock";
import DataTableContainer from "../../components/datatable";

interface DashboardPageProps {
  userId?: string;
}

const DashboardPage = ({ userId }: DashboardPageProps) => {
  const { error, setError, isLoading, setLoading } = useStore();

  const [stats, setStats] = useState<typeof CARD_MOCK_DATA>([]);
  const [recentActivity, setRecentActivity] = useState<
    typeof RECENT_ACTIVITY_MOCK_DATA
  >([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const loadData = async () => {
      try {
        const customers = await fetchStats(signal);
        const activity = await fetchRecentActivity(signal);

        setStats(customers);
        setRecentActivity(activity);
      } catch (err: unknown) {
        if (err && typeof err === "object" && "message" in err) {
          setError((err as { message: string }).message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      controller.abort();
    };
  }, [userId, setError, setLoading]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid gap-6 w-full">
      <div className="w-full gap-6">
        <h2 className="text-2xl font-bold text-foreground">
          Collections Dashboard
        </h2>
        <p className="text-base text-secondary">
          Monitor and manage your accounts receivable in real-time
        </p>
      </div>

      <div className="grid md:grid-cols-4 grid-cols-2 gap-6 w-full">
        {stats.map((card) => (
          <StatCard
            key={card.id}
            label={card.label}
            value={card.value}
            icon={(() => {
              switch (card.icon) {
                case "RiMoneyDollarCircleLine":
                  return <RiMoneyDollarCircleLine className="text-white" />;
                case "RiLineChartLine":
                  return <RiLineChartLine className="text-white" />;
                case "RiUser3Line":
                  return <RiUser3Line className="text-white" />;
                case "RiTimeLine":
                  return <RiTimeLine className="text-white" />;
                default:
                  return null;
              }
            })()}
            iconBgColor={card.iconBgColor}
            percentageChange={card.change}
            percentageColor={
              card.changeType === "positive" ? "success" : "error"
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-6 w-full">
        <DataTableContainer />

        <div className="flex flex-col gap-6">
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <RiPulseLine className="text-xl text-info fill-blue-500" />
              <h3 className="text-lg font-bold text-foreground">
                Recent Activity
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {recentActivity.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  title={activity.title}
                  subtitle={activity.details}
                  amount={activity.amount}
                  timestamp={activity.timestamp}
                  activityType={activity.type as ActivityType}
                />
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <RiAlertLine className="text-xl fill-yellow-400" />
              <h3 className="text-lg font-bold text-foreground">
                Priority Actions
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {PRIORITY_ACTION_MOCK_DATA.map((action) => (
                <ActionItem
                  key={action.id}
                  title={action.title}
                  subtitle={action.subtitle}
                  statusColor={
                    action.indicatorColor as "success" | "warning" | "error"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
