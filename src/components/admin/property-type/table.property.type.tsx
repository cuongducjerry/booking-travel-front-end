import { getPropertyTypesAPI, deletePropertyTypeAPI } from '@/services/api';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { hasPermission } from '@/utils/permission';
import DetailPropertyType from 'components/admin/property-type/detail.property.type';
import CreatePropertyType from 'components/admin/property-type/create.property.type';
import UpdatePropertyType from 'components/admin/property-type/update.property.type';

type TSearch = {
    keyword?: string;
};

const TablePropertyType = () => {
    const actionRef = useRef<ActionType>();
    const { message, notification } = App.useApp();
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IPropertyType | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IPropertyType | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (id: number) => {
        setIsDeleting(true);
        const res = await deletePropertyTypeAPI(id);
        if (res.statusCode === 200) {
            message.success('Property Type deletion successful');
            refreshTable();
            return;
        } else {
            notification.error({
                message: 'An error occurred',
                description: res.message,
            });
        }
        setIsDeleting(false);
    };

    const columns: ProColumns<IPropertyType>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                const canView = hasPermission('PROPERTY_TYPE_VIEW');

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
        {
            title: 'Keyword',
            dataIndex: 'keyword',
            hideInTable: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            hideInSearch: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            valueType: 'dateTime',
            hideInSearch: true,
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            hideInSearch: true,
        },
        {
            title: 'Updated By',
            dataIndex: 'updatedBy',
            hideInSearch: true,
        },
        {
            hideInSearch: true,
            render: (dom, entity, index, action, schema) => (
                <>
                    {hasPermission('PROPERTY_TYPE_UPDATE') && (
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: 'pointer', marginRight: 16 }}
                            onClick={() => {
                                setDataUpdate(entity);
                                setOpenModalUpdate(true);
                            }}
                        />
                    )}

                    {hasPermission('PROPERTY_TYPE_DELETE') && (
                        <Popconfirm
                            title="Confirm deletion"
                            description="Are you sure you want to delete this Property Type?"
                            onConfirm={() => handleDelete(entity.id)}
                            okButtonProps={{ loading: isDeleting }}
                        >
                            <DeleteTwoTone
                                twoToneColor="#ff4d4f"
                                style={{ cursor: 'pointer' }}
                            />
                        </Popconfirm>
                    )}
                </>
            ),
        },
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IPropertyType, TSearch>
                actionRef={actionRef}
                rowKey="id"
                search={{ collapseRender: false }}
                columns={columns}
                headerTitle="Property Type Management"
                pagination={{ showSizeChanger: true }}
                toolBarRender={() => [
                    hasPermission('PROPERTY_TYPE_CREATE') && (
                        <Button
                            key="add"
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setOpenModalCreate(true)
                            }}
                        >
                            Add Property Type
                        </Button>
                    ),
                ]}
                request={async (params, sort) => {
                    let sortParam = 'id,desc';

                    if (sort?.id) {
                        sortParam = `id,${sort.id === 'ascend' ? 'asc' : 'desc'}`;
                    } else if (sort?.createdAt) {
                        sortParam = `createdAt,${sort.createdAt === 'ascend' ? 'asc' : 'desc'}`;
                    }

                    const res = await getPropertyTypesAPI({
                        page: (params.current ?? 1) - 1,
                        size: params.pageSize ?? 5,
                        keyword: params.keyword,
                        sort: sortParam,
                    });

                    return {
                        data: res.data?.result ?? [],
                        total: res.data?.meta.total ?? 0,
                        success: true,
                    };
                }}
            />

            <DetailPropertyType
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <CreatePropertyType
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <UpdatePropertyType
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />

        </>
    );
};

export default TablePropertyType;