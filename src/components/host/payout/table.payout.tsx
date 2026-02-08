import DetailPayout from "@/components/admin/payout/detail.payout";
import { getMyPayoutsAPI } from "@/services/api";
import { hasPermission } from "@/utils/permission";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { App, Tag } from "antd";
import { useRef, useState } from "react";

type TSearch = {
    status?: "PENDING" | "PAID" | "REJECTED";
};

const HostPayoutTable = () => {
    const actionRef = useRef<ActionType>();
    const { message } = App.useApp();

    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] =
        useState<IResHostPayout | null>(null);

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
            render: (_, r) => (
                <Tag color="green">{r.netAmount.toLocaleString()}</Tag>
            ),
        },

        /* ===== STATUS ===== */
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
                const colorMap: Record<string, string> = {
                    PENDING: "processing",
                    PAID: "green",
                    REJECTED: "red",
                };

                return (
                    <Tag color={colorMap[record.status]}>
                        {record.status}
                    </Tag>
                );
            },
        },
    ];

    return (
        <>
            <ProTable<IResHostPayout, TSearch>
                actionRef={actionRef}
                columns={columns}
                rowKey="id"
                headerTitle="My Payouts"
                search={{ labelWidth: 120, collapseRender: false }}
                pagination={{ showSizeChanger: true }}
                request={async (params, sort) => {
                    let sortParam = "id,desc";

                    if (sort?.id) {
                        sortParam = `id,${sort.id === "ascend" ? "asc" : "desc"
                            }`;
                    }

                    try {
                        const res = await getMyPayoutsAPI({
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
            />

            <DetailPayout
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
        </>
    );
};

export default HostPayoutTable;