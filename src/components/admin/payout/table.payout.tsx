import { getAllPayoutsAPI } from "@/services/api";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { App, Button, Tag } from "antd";
import { useRef, useState } from "react";
import DetailPayout from "components/admin/payout/detail.payout";
import { hasPermission } from "@/utils/permission";
import { EditTwoTone, PlusOutlined } from "@ant-design/icons";
import UpdatePayout from "components/admin/payout/update.payout";
import CreatePayout from "components/admin/payout/create.payout";

type TSearch = {
    status?: string;
};

const AdminPayoutTable = () => {
    const actionRef = useRef<ActionType>();
    const { message } = App.useApp();
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState<IResHostPayout | null>(null);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<IResHostPayout | null>(null);

    const columns: ProColumns<IResHostPayout>[] = [
        {
            title: "ID",
            dataIndex: "id",
            sorter: true,
            hideInSearch: true,
            render: (_, entity) => {
                const allowView = hasPermission(["PAYOUT_VIEW"]);

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
            title: "Host ID",
            dataIndex: "hostId",
            hideInSearch: true,
        },
        {
            title: "Contract ID",
            dataIndex: "contractId",
            hideInSearch: true,
        },
        {
            title: "Period",
            hideInSearch: true,
            render: (_, r) => `${r.periodFrom} → ${r.periodTo}`,
        },
        {
            title: "Gross Amount",
            dataIndex: "grossAmount",
            hideInSearch: true,
            render: (_, r) => r.grossAmount.toLocaleString(),
        },
        {
            title: "Commission Fee",
            dataIndex: "commissionFee",
            hideInSearch: true,
            render: (_, r) => r.commissionFee.toLocaleString(),
        },
        {
            title: "Net Amount",
            dataIndex: "netAmount",
            hideInSearch: true,
            render: (_, r) => r.netAmount.toLocaleString(),
        },

        // SEARCH STATUS
        {
            title: "Status",
            dataIndex: "status",
            valueType: "select",
            valueEnum: {
                PENDING: { text: "Pending", status: "Processing" },
                PAID: { text: "Paid", status: "Success" },
                REJECTED: { text: "Rejected", status: "Error" },
            },
            render: (_, record) => {
                const colorMap: any = {
                    PENDING: "processing",
                    PAID: "green",
                    REJECTED: "red",
                };

                return <Tag color={colorMap[record.status]}>{record.status}</Tag>;
            },
        },

        {
            title: "Action",
            hideInSearch: true,
            render: (_, entity) => {
                const canMarkPaid =
                    hasPermission(["PAYOUT_MARK_PAID", "PAYOUT_MARK_REJECTED"], "ALL") &&
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
            <ProTable<IResHostPayout, TSearch>
                actionRef={actionRef}
                columns={columns}
                rowKey="id"
                headerTitle="All Payouts (Admin)"
                search={{ labelWidth: 120, collapseRender: false }}
                pagination={{ showSizeChanger: true }}
                request={async (params, sort) => {
                    let sortParam = "id,desc";

                    if (sort?.id) {
                        sortParam = `id,${sort.id === "ascend" ? "asc" : "desc"}`;
                    }

                    try {
                        const res = await getAllPayoutsAPI({
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
                    } catch {
                        message.error("Không tải được danh sách payout");
                        return { data: [], success: false };
                    }
                }}
                toolBarRender={() => [
                    hasPermission('PAYOUT_CREATE') && (
                        <Button
                            key="add"
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setOpenModalCreate(true)}
                        >
                            Add Payout
                        </Button>
                    ),
                ]}
            />

            <DetailPayout
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <UpdatePayout
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />

            <CreatePayout
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

        </>
    );
};

export default AdminPayoutTable;
