import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import { Line } from "@ant-design/plots";
import { getHostDashboardAPI, getHostRevenueMonthlyAPI } from "@/services/api";

const HostDashboard = () => {
  const [dataDashboard, setDataDashboard] = useState({
    countProperty: 0,
    countBooking: 0,
    countPayout: 0,
    totalGross: 0,
    totalCommission: 0,
    totalNet: 0,
  });

  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    const initDashboard = async () => {
      const res = await getHostDashboardAPI();
      if (res?.data) {
        setDataDashboard(res.data);
      }
    };

    const initRevenue = async () => {
      const res = await getHostRevenueMonthlyAPI();
      if (res?.data) {
        const formatted = res.data.flatMap((item: any) => ([
          {
            month: `${item.month}/${item.year}`,
            type: "Gross",
            value: item.totalGross,
          },
          {
            month: `${item.month}/${item.year}`,
            type: "Net",
            value: item.totalNet,
          },
          {
            month: `${item.month}/${item.year}`,
            type: "Fee",
            value: item.totalCommission,
          },
        ]));

        setRevenueData(formatted);
      }
    };

    initDashboard();
    initRevenue();
  }, []);

  const config = {
    data: revenueData,
    xField: "month",
    yField: "value",
    seriesField: "type",
    smooth: true,
    height: 300,
    xAxis: {
      label: {
        autoRotate: true,
      },
    },
  };

  return (
    <Row gutter={[24, 24]}>
      {/* Stats */}
      <Col span={8}>
        <Card bordered={false}>
          <Statistic title="Properties" value={dataDashboard.countProperty} />
        </Card>
      </Col>

      <Col span={8}>
        <Card bordered={false}>
          <Statistic title="Bookings" value={dataDashboard.countBooking} />
        </Card>
      </Col>

      <Col span={8}>
        <Card bordered={false}>
          <Statistic title="Payouts" value={dataDashboard.countPayout} />
        </Card>
      </Col>

      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title="Total Earned"
            value={dataDashboard.totalNet}
            suffix="VND"
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>

      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title="Fees Paid"
            value={dataDashboard.totalCommission}
            suffix="VND"
          />
        </Card>
      </Col>

      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title="Gross Revenue"
            value={dataDashboard.totalGross}
            suffix="VND"
          />
        </Card>
      </Col>

      {/* Chart */}
      <Col span={24}>
        <Card title="Revenue Last 12 Months" bordered={false}>
          <Line {...config} />
        </Card>
      </Col>
    </Row>
  );
};

export default HostDashboard;