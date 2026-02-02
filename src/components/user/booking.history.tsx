import {
    Card,
    Table,
    Tag,
    Typography,
    Space,
    message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { fetchMyBookings } from "@/services/api";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const BookingHistoryPage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<IBookingDetail[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const loadData = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const res = await fetchMyBookings(page, pageSize);

            const result = res.data;
            if (!result) return;

            console.log(res);

            setData(result.result);
            setPagination({
                current: result.meta.current,
                pageSize: result.meta.pageSize,
                total: result.meta.total,
            });
        } catch {
            message.error("Failed to load booking history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const columns: ColumnsType<IBookingDetail> = [
        {
            title: "Property",
            dataIndex: "propertyName",
        },
        {
            title: "Check in",
            dataIndex: "checkIn",
            render: (value: string) =>
                value ? dayjs(value).format("DD-MM-YYYY") : "-"
        },
        {
            title: "Check out",
            dataIndex: "checkOut",
            render: (value: string) =>
                value ? dayjs(value).format("DD-MM-YYYY") : "-"
        },
        {
            title: "Nights",
            dataIndex: "nights",
            align: "center",
        },
        {
            title: "Total",
            render: (_, r) => (
                <Text strong>
                    {r.grossAmount.toLocaleString()} {r.currency}
                </Text>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (status) => {
                const colorMap: Record<string, string> = {
                    NEW: "blue",
                    CONFIRMED: "green",
                    CANCELLED: "red",
                    DONE: "default",
                    PENDING: "yellow",
                    CANCEL_REQUESTED: "red"
                };
                return <Tag color={colorMap[status]}>{status}</Tag>;
            },
        },
        {
            title: "Created",
            dataIndex: "createdAt",
            render: (v) => new Date(v).toLocaleString(),
        },
    ];

    return (
        <div style={{ maxWidth: 1100, margin: "40px auto" }}>
            <Card>
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <Title level={3}>📜 My booking history</Title>

                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={{
                            ...pagination,
                            onChange: loadData,
                        }}
                    />
                </Space>
            </Card>
        </div>
    );
};

export default BookingHistoryPage;