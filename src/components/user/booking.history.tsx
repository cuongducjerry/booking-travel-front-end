import {
    Card,
    Table,
    Tag,
    Typography,
    Space,
    App,
    Button,
    Rate,
    Input,
    Modal,
    Popconfirm,
    Tooltip
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { createReviewAPI, deleteReviewAPI, fetchMyBookings, updateReviewAPI } from "@/services/api";
import dayjs from "dayjs";
import { hasPermission } from "@/utils/permission";
import TextArea from "antd/es/input/TextArea";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const BookingHistoryPage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<IBookingDetail[]>([]);
    const { message, notification, modal } = App.useApp();
    const [openReview, setOpenReview] = useState(false);
    const [reviewMode, setReviewMode] = useState<"create" | "update" | "view">("create");
    const [reviewBooking, setReviewBooking] = useState<IBookingDetail | null>(null);
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState<string>("");
    const [reviewId, setReviewId] = useState<number | null>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const handleDeleteReview = async (reviewId: number) => {
        try {
            await deleteReviewAPI(reviewId);
            message.success("Review deleted");

            // Reload the table, keeping the current page.
            loadData(pagination.current, pagination.pageSize);
        } catch {
            message.error("Delete a failed rating");
        }
    };

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
        {
            title: "Action",
            align: "center",
            render: (_, record) => {
                if (record.status !== "DONE") return null;

                const review = record.review;

                const canCreate = hasPermission(["REVIEW_CREATE"]);
                const canUpdate = hasPermission(["REVIEW_UPDATE"]);
                const canDelete = hasPermission(["REVIEW_DELETE"]);

                return (
                    <Space>
                        {/* CREATE */}
                        {!review && canCreate && (
                            <Tooltip title="Review">
                                <Button
                                    type="text"
                                    icon={<PlusCircleOutlined />}
                                    onClick={() => {
                                        setReviewMode("create");
                                        setReviewBooking(record);
                                        setRating(5);
                                        setComment("");
                                        setOpenReview(true);
                                    }}
                                />
                            </Tooltip>
                        )}

                        {/* VIEW */}
                        {review && (
                            <Tooltip title="View review">
                                <Button
                                    type="text"
                                    icon={<EyeOutlined />}
                                    onClick={() => {
                                        setReviewMode("view");
                                        setReviewId(review.id);
                                        setRating(review.rating);
                                        setComment(review.comment);
                                        setOpenReview(true);
                                    }}
                                />
                            </Tooltip>
                        )}

                        {/* UPDATE */}
                        {review && canUpdate && (
                            <Tooltip title="Edit review">
                                <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        setReviewMode("update");
                                        setReviewId(review.id);
                                        setRating(review.rating);
                                        setComment(review.comment);
                                        setOpenReview(true);
                                    }}
                                />
                            </Tooltip>
                        )}

                        {/* DELETE */}
                        {review && canDelete && (
                            <Popconfirm
                                title="Delete this review?"
                                onConfirm={() => handleDeleteReview(review.id)}
                            >
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                />
                            </Popconfirm>
                        )}
                    </Space>
                );
            },
        }

    ];

    return (
        <div style={{ maxWidth: 1300, margin: "40px auto" }}>
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

                    <Modal
                        open={openReview}
                        title={
                            reviewMode === "create"
                                ? "⭐ Đánh giá property"
                                : reviewMode === "update"
                                    ? "✏️ Cập nhật đánh giá"
                                    : "👁 Chi tiết đánh giá"
                        }
                        okText={
                            reviewMode === "view" ? undefined :
                                reviewMode === "create" ? "Gửi đánh giá" : "Cập nhật"
                        }
                        onCancel={() => setOpenReview(false)}
                        onOk={async () => {
                            if (reviewMode === "view") return;

                            if (reviewMode === "create") {
                                await createReviewAPI(reviewBooking!.propertyId, {
                                    rating,
                                    comment,
                                });
                            }

                            if (reviewMode === "update") {
                                await updateReviewAPI({
                                    id: reviewId!,
                                    rating,
                                    comment,
                                });
                            }

                            setOpenReview(false);
                            loadData();
                        }}
                        okButtonProps={{
                            disabled: reviewMode === "view",
                        }}
                    >
                        <div style={{ marginBottom: 16 }}>
                            <Rate
                                value={rating}
                                disabled={reviewMode === "view"}
                                onChange={setRating}
                            />
                        </div>

                        <TextArea
                            rows={4}
                            value={comment}
                            disabled={reviewMode === "view"}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Chia sẻ trải nghiệm của bạn…"
                        />
                    </Modal>
                </Space>
            </Card>
        </div>
    );
};

export default BookingHistoryPage;