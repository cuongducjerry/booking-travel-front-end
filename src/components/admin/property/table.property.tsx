import { getMyPropertiesAPI, getPropertyTypesAPI } from "@/services/api";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { App, Tag, Space, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { hasPermission } from "@/utils/permission";
import { EditTwoTone } from "@ant-design/icons";
import DetailProperty from "components/host/property/detail.property";
import UpdateProperty from "./update.property";

type TSearch = {
    title?: string;
    status?: string;
    propertyType?: string;
};

const AdminTableProperty = () => {
    const actionRef = useRef<ActionType>();
    const { message } = App.useApp();

    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState<IPropertyTable | null>(null);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IPropertyTable | null>(null);
    const [propertyTypes, setPropertyTypes] = useState<IPropertyType[]>([]);

    // =======================
    // LOAD PROPERTY TYPES
    // =======================
    useEffect(() => {
        (async () => {
            try {
                const res = await getPropertyTypesAPI({ page: 0, size: 1000 });
                setPropertyTypes(res.data?.result ?? []);
            } catch {
                message.error("Property Type list failed to load!");
            }
        })();
    }, []);

    const columns: ProColumns<IPropertyTable>[] = [
        {
            title: "ID",
            dataIndex: "id",
            sorter: true,
            hideInSearch: true,
            render: (_, entity) => {
                return (
                    <a
                        onClick={() => {
                            setDataViewDetail(entity);
                            setOpenViewDetail(true);
                        }}
                    >
                        {entity.id}
                    </a>
                ) 
            },
        },

        {
            title: "Title",
            dataIndex: "title",
        },

        {
            title: "Owner",
            dataIndex: "hostName",
            hideInSearch: true,
        },

        {
            title: "Property Type",
            dataIndex: "propertyTypeName",
            hideInSearch: true,
        },

        // SEARCH PROPERTY TYPE
        {
            title: "Property Type",
            dataIndex: "propertyType",
            valueType: "select",
            hideInTable: true,
            fieldProps: {
                showSearch: true,
                placeholder: "Select property type",
                options: propertyTypes.map((pt) => ({
                    label: pt.name,
                    value: pt.name,
                })),
            },
        },

        {
            title: "Status",
            dataIndex: "status",
            valueType: "select",
            valueEnum: {
                DRAFT: { text: "Draft", status: "Default" },
                PENDING: { text: "Pending", status: "Processing" },
                APPROVED: { text: "Approved", status: "Success" },
                REJECTED: { text: "Rejected", status: "Error" },
            },
            render: (_, record) => {
                const map: any = {
                    DRAFT: "default",
                    PENDING: "processing",
                    APPROVED: "green",
                    REJECTED: "red",
                };
                return <Tag color={map[record.status]}>{record.status}</Tag>;
            },
        },

        {
            title: "Price / Night",
            dataIndex: "pricePerNight",
            hideInSearch: true,
            render: (_, r) => `${r.pricePerNight.toLocaleString()} ${r.currency}`,
        },

        {
            title: "Created At",
            dataIndex: "createdAt",
            valueType: "dateTime",
            sorter: true,
            hideInSearch: true,
        },

        // =======================
        // ACTIONS (ADMIN)
        // =======================
        {
            title: "Action",
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {hasPermission(["PROPERTY_APPROVE", "PROPERTY_DELETE_APPROVE"], "ALL") && (
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
        },
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IPropertyTable, TSearch>
                actionRef={actionRef}
                columns={columns}
                rowKey="id"
                headerTitle="All Properties (Admin)"
                search={{ labelWidth: 120, collapseRender: false }}
                pagination={{ showSizeChanger: true }}
                request={async (params, sort) => {
                    let sortParam = "id,desc";

                    if (sort?.id)
                        sortParam = `id,${sort.id === "ascend" ? "asc" : "desc"}`;
                    else if (sort?.createdAt)
                        sortParam = `createdAt,${sort.createdAt === "ascend" ? "asc" : "desc"
                            }`;

                    const res = await getMyPropertiesAPI({
                        page: (params.current ?? 1) - 1,
                        size: params.pageSize ?? 10,
                        sort: sortParam,
                        title: params.title,
                        status: params.status,
                        propertyType: params.propertyType,
                    });

                    return {
                        data: res.data?.result ?? [],
                        total: res.data?.meta.total ?? 0,
                        success: true,
                    };
                }}
            />

            <DetailProperty
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <UpdateProperty
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />

        </>
    );
};

export default AdminTableProperty;
