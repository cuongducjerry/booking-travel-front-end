import { deleteAmenityAPI, getAmenitiesAPI } from '@/services/api';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { hasPermission } from '@/utils/permission';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AMENITY_ICON_MAP, DEFAULT_AMENITY_ICON, type AmenityIconKey } from "@/utils/constants/amenity.icon";
import DetailAmenity from 'components/admin/amenity/detail.amenity';
import CreateAmenity from 'components/admin/amenity/create.amenity';
import UpdateAmenity from 'components/admin/amenity/update.amenity';

const TableAmenity = () => {
    const actionRef = useRef<ActionType>();
    const { message, notification } = App.useApp();

    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState<IAmenity | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<IAmenity | null>(null);

    const [dataSource, setDataSource] = useState<IAmenity[]>([]);
    const [usedIcons, setUsedIcons] = useState<AmenityIconKey[]>([]);
    const [isDelete, setIsDelete] = useState(false);

    const handleDelete = async (id: number) => {
        try {
            setIsDelete(true);
            const res = await deleteAmenityAPI(id);

            if (res.statusCode === 200) {
                message.success('Xóa amenity thành công');
                refreshTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message,
                });
            }
        } finally {
            setIsDelete(false);
        }
    };

    const columns: ProColumns<IAmenity>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
            hideInSearch: true,
            render(_, entity) {
                const canView = hasPermission('AMENITY_VIEW');
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
            },
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
            title: 'Icon',
            dataIndex: 'icon',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => {
                const icon = AMENITY_ICON_MAP[record.icon] || DEFAULT_AMENITY_ICON;
                return (
                    <FontAwesomeIcon
                        icon={icon}
                        style={{ fontSize: 18, color: '#1677ff' }}
                    />
                );
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Action',
            hideInSearch: true,
            render: (_, entity) => (
                <>
                    {hasPermission('AMENITY_UPDATE') && (
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: 'pointer', marginRight: 16 }}
                            onClick={() => {
                                setDataUpdate(entity);
                                setOpenModalUpdate(true);
                            }}
                        />
                    )}

                    {hasPermission('AMENITY_DELETE') && (
                        <Popconfirm
                            placement="leftTop"
                            title="Xác nhận xóa amenity"
                            onConfirm={() => handleDelete(entity.id)}
                            okButtonProps={{ loading: isDelete }}
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
        setUsedIcons([]);
    };

    return (
        <>
            <ProTable<IAmenity>
                headerTitle="Amenity Management"
                columns={columns}
                actionRef={actionRef}
                rowKey="id"
                search={{ collapseRender: false }}
                request={async (params, sort) => {
                    let sortParam = 'id,desc';

                    if (sort?.id) {
                        sortParam = `id,${sort.id === 'ascend' ? 'asc' : 'desc'}`;
                    } else if (sort?.createdAt) {
                        sortParam = `createdAt,${sort.createdAt === 'ascend' ? 'asc' : 'desc'}`;
                    }

                    const res = await getAmenitiesAPI({
                        page: (params.current ?? 1) - 1,
                        size: params.pageSize ?? 5,
                        keyword: params.keyword,
                        sort: sortParam,
                    });

                    const data = res.data?.result ?? [];

                    setDataSource(data);

                    setUsedIcons(prev => {
                        const merged: AmenityIconKey[] = [
                            ...prev,
                            ...data.map(item => item.icon as AmenityIconKey)
                        ];
                        return Array.from(new Set(merged));
                    });

                    return {
                        data,
                        total: res.data?.meta.total ?? 0,
                        success: true,
                    };
                }}
                pagination={{ showSizeChanger: true }}
                toolBarRender={() => [
                    hasPermission('AMENITY_CREATE') && (
                        <Button
                            key="add"
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setOpenModalCreate(true)}
                        >
                            Add Amenity
                        </Button>
                    ),
                ]}
            />

            <DetailAmenity
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <CreateAmenity
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
                usedIcons={usedIcons}
            />

            <UpdateAmenity
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                usedIcons={usedIcons}
            />

        </>
    );
};

export default TableAmenity;
