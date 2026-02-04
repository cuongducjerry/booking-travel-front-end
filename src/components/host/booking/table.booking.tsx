import { getHostBookingsAPI } from "@/services/api";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { App, Tag } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import { hasPermission } from "@/utils/permission";
import DetailBooking from "components/host/booking/detail.booking";
import UpdateBooking from "components/host/booking/update.booking";
import { EditTwoTone } from "@ant-design/icons";

type TSearch = {
    status?: "NEW" | "PENDING" | "CONFIRMED" | "CANCEL_REQUESTED" | "CANCELLED" | "DONE"
};

const HostTableBooking = () => {
    const actionRef = useRef<ActionType>();
    const { notification } = App.useApp();
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IBookingDetail | null>(null);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IBookingDetail | null>(null);

    const columns: ProColumns<IBookingDetail>[] = [
        {
            title: "ID",
            dataIndex: "id",
            sorter: true,
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                const canView = hasPermission('BOOKING_VIEW_DETAIL');

                return canView ? (
                    <a
                        onClick={() => {
                            setDataViewDetail(entity);
                            setOpenViewDetail(true);
                        }}
                    >
                        {entity.id}
                    </a>
                ) : (
                    <span>{entity.id}</span>
                );
            }
        },

        // STATUS (search + display)
        {
            title: "Status",
            dataIndex: "status",
            valueType: "select",
            valueEnum: {
                NEW: { text: "New", status: "Default" },
                PENDING: { text: "Pending", status: "Warning" },
                CONFIRMED: { text: "Confirmed", status: "Success" },
                CANCEL_REQUESTED: { text: "Cancel Requested", status: "Processing" },
                CANCELLED: { text: "Cancelled", status: "Error" },
                DONE: { text: "Done", status: "Success" },
            },
            render: (_, record) => {
                const statusConfig: Record<
                    string,
                    { color: string; label: string }
                > = {
                    NEW: { color: "blue", label: "New" },
                    PENDING: { color: "orange", label: "Pending" },
                    CONFIRMED: { color: "green", label: "Confirmed" },
                    CANCEL_REQUESTED: { color: "gold", label: "Cancel Requested" },
                    CANCELLED: { color: "red", label: "Cancelled" },
                    DONE: { color: "purple", label: "Done" },
                };

                const config = statusConfig[record.status] ?? {
                    color: "default",
                    label: record.status,
                };

                return <Tag color={config.color}>{config.label}</Tag>;
            },
        },
        {
            title: "Property",
            dataIndex: "propertyName",
            hideInSearch: true,
        },

        {
            title: "Khách",
            dataIndex: "userName",
            hideInSearch: true,
        },
        {
            title: "Check In",
            dataIndex: "checkIn",
            valueType: "date",
            hideInSearch: true,
            render: (_, r) => dayjs(r.checkIn).format("DD/MM/YYYY"),
        },

        {
            title: "Check Out",
            dataIndex: "checkOut",
            valueType: "date",
            hideInSearch: true,
            render: (_, r) => dayjs(r.checkOut).format("DD/MM/YYYY"),
        },

        {
            title: "Nights",
            dataIndex: "nights",
            hideInSearch: true,
        },

        {
            title: "Tổng tiền",
            dataIndex: "grossAmount",
            hideInSearch: true,
            render: (_, r) =>
                `${r.grossAmount.toLocaleString()} ${r.currency}`,
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            valueType: "dateTime",
            sorter: true,
            hideInSearch: true,
        },
        {
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {hasPermission(["BOOKING_CONFIRM", "BOOKING_CANCEL", "BOOKING_DONE"], "ALL") && (
                            <EditTwoTone
                                twoToneColor="#f57800"
                                style={{ cursor: "pointer", marginRight: 15 }}
                                onClick={() => {
                                    setDataUpdate(entity);
                                    setOpenModalUpdate(true);
                                }}
                            />
                        )}
                    </>
                )
            },
        }
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IBookingDetail, TSearch>
                actionRef={actionRef}
                rowKey="id"
                columns={columns}
                headerTitle="Danh sách booking của tôi"
                search={{ collapseRender: false }}
                pagination={{ showSizeChanger: true }}
                request={async (params, sort) => {
                    try {
                        let sortParam = "id,desc";
                        if (sort?.id) {
                            sortParam = `id,${sort.id === "ascend" ? "asc" : "desc"}`;
                        } else if (sort?.createdAt) {
                            sortParam = `createdAt,${sort.createdAt === "ascend" ? "asc" : "desc"
                                }`;
                        }

                        const res = await getHostBookingsAPI({
                            page: (params.current ?? 1) - 1,
                            size: params.pageSize ?? 5,
                            status: params.status,
                            sort: sortParam,
                        });

                        return {
                            data: res.data?.result ?? [],
                            total: res.data?.meta.total ?? 0,
                            success: true,
                        };
                    } catch (error: any) {
                        notification.error({
                            message: "Không thể tải booking",
                            description: error?.message || "Lỗi hệ thống",
                        });
                        return { data: [], success: false };
                    }
                }}
            />

            <DetailBooking
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <UpdateBooking
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />

        </>
    );
};

export default HostTableBooking;
