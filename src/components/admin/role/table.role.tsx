import { deleteRoleAPI, getRolesAPI } from '@/services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm, Tag } from 'antd';
import { useRef, useState } from 'react';
import { hasPermission } from '@/utils/permission';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import CreateRole from 'components/admin/role/create.role';
import UpdateRole from 'components/admin/role/update.role';
import DetailRole from 'components/admin/role/detail.role';

type TSearchRole = {
    keyword?: string;
};

const TableRole = () => {
    const actionRef = useRef<ActionType>();
    const { message, notification } = App.useApp();
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IRole | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IRole | null>(null);
    const [isDeleteRole, setIsDeleteRole] = useState<boolean>(false);

    const handleDeleteRole = async (id: number) => {
        setIsDeleteRole(true);
        const res = await deleteRoleAPI(id);
        if (res.statusCode === 200) {
            message.success('Xóa role thành công');
            refreshTable();
            return;
        }
        else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsDeleteRole(false);
    }

    const columns: ProColumns<IRole>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
            width: 80,
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                const canView = hasPermission('ROLE_VIEW');

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
            title: 'Role Name',
            dataIndex: 'name',
            render: (_, record) => (
                <Tag color="blue">{record.name}</Tag>
            ),
            hideInSearch: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            ellipsis: true,
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
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {hasPermission("ROLE_UPDATE") && (
                            <EditTwoTone
                                twoToneColor="#f57800"
                                style={{ cursor: "pointer", marginRight: 15 }}
                                onClick={() => {
                                    setDataUpdate(entity);
                                    setOpenModalUpdate(true);
                                }}
                            />
                        )}

                        {hasPermission("ROLE_DELETE") && (
                            <Popconfirm
                                placement="leftTop"
                                title={"Xác nhận xóa role"}
                                description={"Bạn có chắc chắn muốn xóa role này ?"}
                                onConfirm={() => handleDeleteRole(entity.id)}
                                okText="Xác nhận"
                                cancelText="Hủy"
                                okButtonProps={{ loading: isDeleteRole }}
                            >
                                <span style={{ cursor: "pointer", marginLeft: 20 }}>
                                    <DeleteTwoTone
                                        twoToneColor="#ff4d4f"
                                        style={{ cursor: "pointer" }}
                                    />
                                </span>
                            </Popconfirm>
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
            <ProTable<IRole, TSearchRole>
                headerTitle="Role Management"
                actionRef={actionRef}
                rowKey="id"
                columns={columns}
                search={{ collapseRender: false }}
                pagination={{ showSizeChanger: true }}
                request={async (params, sort) => {
                    if (!hasPermission('ROLE_LIST_ALL')) {
                        message.error('Bạn không có quyền xem role');
                        return {
                            data: [],
                            success: false,
                            total: 0,
                        };
                    }

                    // field + direction
                    let sortParam = 'id,desc'; // default

                    if (sort?.id) {
                        sortParam = `id,${sort.id === 'ascend' ? 'asc' : 'desc'}`;
                    } else if (sort?.createdAt) {
                        sortParam = `createdAt,${sort.createdAt === 'ascend' ? 'asc' : 'desc'}`;
                    }

                    const res = await getRolesAPI({
                        page: (params.current ?? 1) - 1,
                        size: params.pageSize ?? 10,
                        keyword: params.keyword,
                        sort: sortParam,
                    });

                    return {
                        data: res.data?.result ?? [],
                        total: res.data?.meta.total ?? 0,
                        success: true,
                    };
                }}
                toolBarRender={() => [
                    hasPermission("ROLE_CREATE") && (
                        <Button
                            key="add"
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setOpenModalCreate(true);
                            }}
                        >
                            Add role
                        </Button>
                    )
                ]}
            />

            <DetailRole
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <CreateRole
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <UpdateRole
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />

        </>
    );
};

export default TableRole;