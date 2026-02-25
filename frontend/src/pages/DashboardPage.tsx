import { useEffect, useState } from "react";
import API from "../services/api";
import { DashboardSummary } from "../types";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/api/dashboard/summary");
        setDashboard(response.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    fetchData();
  }, []);

  if (!dashboard) return <div>Loading...</div>;

  return (
    <div>
      <h1>Total Revenue: {dashboard.today.totalRevenue}</h1>
      <h2>Total Orders: {dashboard.today.totalOrders}</h2>
    </div>
  );
}
