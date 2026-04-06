import { getAllFeesAPI } from "@/services/api";
import { hasPermission } from "@/utils/permission";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { App, Tag } from "antd";
import { useRef, useState } from "react";
import DetailFee from "components/admin/fee/detail.fee";
import UpdateFee from "./update.fee";
import { EditTwoTone } from "@ant-design/icons";

type TSearch = {
    status?: string;
};

const AdminTableFee = () => {
    const actionRef = useRef<ActionType>();
    const { message } = App.useApp();
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState<IResHostFee | null>(null);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IResHostFee | null>(null);

    const columns: ProColumns<IResHostFee>[] = [
        {
            title: "ID",
            dataIndex: "id",
            sorter: true,
            hideInSearch: true,
            render: (_, entity) => {
                const allowView = hasPermission(["FEE_DETAIL"]);

                if (!allowView) {
                    return <span>{entity.id}</span>;
                }

                return (
                    <a
                        onClick={() => {
                            setDataViewDetail(entity);
                            setOpenViewDetail(true);
                        }}
                    >
                        {entity.id}
                    </a>
                );
            },
        },
        {
            title: "Booking ID",
            dataIndex: "bookingId",
            hideInSearch: true,
        },
        {
            title: "Amount",
            dataIndex: "amount",
            hideInSearch: true,
            render: (_, r) => r.amount.toLocaleString(),
        },
        {
            title: "Rate (%)",
            dataIndex: "rate",
            hideInSearch: true,
            render: (_, r) => `${r.rate}%`,
        },
        {
            title: "Due At",
            dataIndex: "dueAt",
            hideInSearch: true,
        },
        {
            title: "Paid At",
            dataIndex: "paidAt",
            hideInSearch: true,
            render: (_, r) => r.paidAt ?? "-",
        },

        // SEARCH + TAG STATUS
        {
            title: "Status",
            dataIndex: "status",
            valueType: "select",
            valueEnum: {
                PENDING: { text: "Pending", status: "Processing" },
                PAID: { text: "Paid", status: "Success" },
                OVERDUE: { text: "Overdue", status: "Error" },
            },
            render: (_, record) => {
                const colorMap: Record<string, string> = {
                    PENDING: "processing",
                    PAID: "green",
                    OVERDUE: "red",
                };
                return (
                    <Tag color={colorMap[record.status]}>
                        {record.status}
                    </Tag>
                );
            },
        },

        {
            title: "Action",
            hideInSearch: true,
            render: (_, entity) => {
                const canMarkPaid =
                    hasPermission(["FEE_UPDATE"]) &&
                    entity.status === "PENDING";

                if (!canMarkPaid) return null;

                return (
                    <EditTwoTone
                        twoToneColor="#52c41a"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setDataUpdate(entity);
                            setOpenModalUpdate(true);
                        }}
                    />
                );
            },
        },
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IResHostFee, TSearch>
                actionRef={actionRef}
                columns={columns}
                rowKey="id"
                headerTitle="All Fees (Admin)"
                search={{ labelWidth: 120, collapseRender: false }}
                pagination={{ showSizeChanger: true }}
                request={async (params, sort) => {
                    let sortParam = "id,desc";

                    if (sort?.id) {
                        sortParam = `id,${sort.id === "ascend" ? "asc" : "desc"
                            }`;
                    }

                    try {
                        const res = await getAllFeesAPI({
                            page: (params.current ?? 1) - 1,
                            size: params.pageSize ?? 10,
                            sort: sortParam,
                            status: params.status,
                        });

                        return {
                            data: res.data?.result ?? [],
                            total: res.data?.meta.total ?? 0,
                            success: true,
                        };
                    } catch (error) {
                        message.error("Unable to load the fee list");
                        return {
                            data: [],
                            success: false,
                        };
                    }
                }}
            />

            <DetailFee
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <UpdateFee
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />

        </>
    );
};

export default AdminTableFee;
