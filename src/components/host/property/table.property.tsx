import { getMyPropertiesAPI, getPropertyTypesAPI } from "@/services/api";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { App, Tag, Select, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { hasPermission } from "@/utils/permission";
import { EditTwoTone, PlusOutlined } from "@ant-design/icons";
import DetailProperty from "components/host/property/detail.property";
import { useNavigate } from "react-router-dom";
import { getAmenitiesAPI } from "@/services/api";

type TSearch = {
    title?: string;
    status?: string;
    propertyType?: string;
};

const HostTableProperty = () => {
    const actionRef = useRef<ActionType>();
    const { message } = App.useApp();
    const navigate = useNavigate();

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IPropertyTable | null>(null);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [propertyTypes, setPropertyTypes] = useState<IPropertyType[]>([]);


    // =======================
    // LOAD PROPERTY TYPES
    // =======================
    useEffect(() => {
        const fetchPropertyTypes = async () => {
            try {
                const res = await getPropertyTypesAPI({
                    page: 0,
                    size: 1000,
                });
                setPropertyTypes(res.data?.result ?? []);
            } catch (err) {
                message.error("Không tải được danh sách Property Type");
            }
        };

        fetchPropertyTypes();
    }, []);

    const columns: ProColumns<IPropertyTable>[] = [
        {
            title: "ID",
            dataIndex: "id",
            sorter: true,
            hideInSearch: true,
            render(dom, entity, index, action, schema) {

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
            }
        },

        {
            title: "Title",
            dataIndex: "title",
        },

        {
            title: "Property Type",
            dataIndex: "propertyTypeName",
            hideInSearch: true,
        },

        // =======================
        // SEARCH: PROPERTY TYPE
        // =======================
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
            render: (_, record) =>
                `${record.pricePerNight.toLocaleString()} ${record.currency}`,
        },

        {
            title: "Created At",
            dataIndex: "createdAt",
            valueType: "dateTime",
            sorter: true,
            hideInSearch: true,
        },

        {
            title: "Action",
            valueType: "option",
            hideInSearch: true,
            render: (_, entity) => {
                const allowEdit =
                    hasPermission(["PROPERTY_UPDATE", "PROPERTY_VIEW", "PROPERTY_DRAFT_IMAGE_LIST"], "ALL") &&
                    ["DRAFT", "REJECTED", "APPROVED", "PENDING"].includes(entity.status); // PENDING just view, not edit

                if (!allowEdit) return null;

                return (
                    <EditTwoTone
                        twoToneColor="#f57800"
                        style={{ cursor: "pointer", fontSize: 18 }}
                        onClick={() => {
                            navigate(`/host/property/update/${entity.id}`);
                        }}
                    />
                );
            },
        }
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
                headerTitle="My Properties"
                search={{
                    labelWidth: 120,
                    collapseRender: false,
                }}
                pagination={{ showSizeChanger: true }}
                request={async (params, sort) => {
                    let sortParam = "id,desc";

                    if (sort?.id) {
                        sortParam = `id,${sort.id === "ascend" ? "asc" : "desc"}`;
                    } else if (sort?.createdAt) {
                        sortParam = `createdAt,${sort.createdAt === "ascend" ? "asc" : "desc"
                            }`;
                    }

                    const res = await getMyPropertiesAPI({
                        page: (params.current ?? 1) - 1,
                        size: params.pageSize ?? 10,
                        sort: sortParam,
                        title: params.title,
                        status: params.status,
                        propertyType: params.propertyType, // string
                    });

                    return {
                        data: res.data?.result ?? [],
                        total: res.data?.meta.total ?? 0,
                        success: true,
                    };
                }}
                toolBarRender={() => [
                    hasPermission("PROPERTY_CREATE") && (
                        <Button
                            key="add"
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate("/host/property/create")}
                        >
                            Add Property
                        </Button>
                    )
                ]}
            />

            <DetailProperty
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

        </>

    );
};

export default HostTableProperty;

