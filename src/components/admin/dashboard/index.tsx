import { Card, Col, Row, Statistic, Typography } from "antd";
import { useEffect, useState } from "react";

import { getDashboardAPI, getRevenueMonthlyAPI } from "@/services/api";
import { Line } from "@ant-design/charts";

const { Title } = Typography;

const AdminDashboard = () => {
  const [dataDashboard, setDataDashboard] = useState({
    countUser: 0,
    countProperty: 0,
    countBooking: 0,
    countContract: 0,
    countPayout: 0,
    totalGross: 0,
    totalCommission: 0,
    totalNet: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const initDashboard = async () => {
      const res = await getDashboardAPI();
      if (res?.data) setDataDashboard(res.data);
    };

    const initChart = async () => {
      const res = await getRevenueMonthlyAPI();
      if (res?.data) {
        const formatted = res.data.flatMap((item: any) => {
          const month = `${item.year}-${String(item.month).padStart(2, "0")}`;

          return [
            { month, value: item.totalGross, type: "Revenue" },
            { month, value: item.totalCommission, type: "Profit" },
            { month, value: item.totalNet, type: "Host Payment" },
          ];
        });

        setChartData(formatted);
      }
    };

    initDashboard();
    initChart();
  }, []);

  const config = {
    data: chartData,
    xField: "month",
    yField: "value",
    seriesField: "type",
    smooth: true,
    height: 300,
    legend: { position: "top" as const },
  };

  return (
    <div style={{ padding: 20 }}>
      {/* ===== OVERVIEW ===== */}
      <Title level={4}>Overview</Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card hoverable>
            <Statistic title="Users" value={dataDashboard.countUser} />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card hoverable>
            <Statistic title="Properties" value={dataDashboard.countProperty} />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card hoverable>
            <Statistic title="Bookings" value={dataDashboard.countBooking} />
          </Card>
        </Col>
      </Row>

      {/* ===== FINANCIAL ===== */}
      <Title level={4} style={{ marginTop: 30 }}>
        Financial Overview
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card hoverable>
            <Statistic
              title="Revenue"
              value={dataDashboard.totalGross}
              suffix="VND"
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card hoverable>
            <Statistic
              title="Profit"
              value={dataDashboard.totalCommission}
              suffix="VND"
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card hoverable>
            <Statistic
              title="Host Payment"
              value={dataDashboard.totalNet}
              suffix="VND"
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>

      {/* ===== CHART ===== */}
      <Title level={4} style={{ marginTop: 30 }}>
        Revenue by Month
      </Title>
      <Card>
        <Line {...config} />
      </Card>
    </div>
  );
};

export default AdminDashboard;
