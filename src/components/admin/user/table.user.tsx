import { deleteUserAPI, getUsersAPI } from '@/services/api';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import DetailUser from 'components/admin/user/detail.user';
import CreateUser from 'components/admin/user/create.user';
import UpdateUser from 'components/admin/user/update.user';
import { hasPermission } from '@/utils/permission';

type TSearch = {
    keyword?: string;
    role?: string;
    status?: 'PENDING' | 'APPROVED' | 'LOCK';
};

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const { message, notification, modal } = App.useApp();
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);
    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);

    const handleDeleteUser = async (id: number) => {
        setIsDeleteUser(true);
        const res = await deleteUserAPI(id);
        if (res.statusCode === 200) {
            message.success('Xóa user thành công');
            refreshTable();
            return;
        }
        else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsDeleteUser(false);
    }

    const columns: ProColumns<IUserTable>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a
                        onClick={() => {
                            setDataViewDetail(entity);
                            setOpenViewDetail(true);
                        }}
                        href='#'>{entity.id}</a>
                )
            }
        },

        // SEARCH KEYWORD
        {
            title: 'Keyword',
            dataIndex: 'keyword',
            hideInTable: true,
        },

        {
            title: 'Full Name',
            dataIndex: 'fullName',
            hideInSearch: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
            hideInSearch: true,
        },

        // ROLE (SEARCH = role, DISPLAY = role.name)
        {
            title: 'Role',
            dataIndex: 'role',
            valueType: 'select',
            valueEnum: {
                ADMIN: { text: 'ADMIN' },
                USER: { text: 'USER' },
                HOST: { text: 'HOST' },
            },
            render: (_, record) => record.role?.name,
        },

        // STATUS SEARCH OK
        {
            title: 'Status',
            dataIndex: 'status',
            valueType: 'select',
            valueEnum: {
                PENDING: { text: 'Pending', status: 'Warning' },
                APPROVED: { text: 'Approved', status: 'Success' },
                LOCK: { text: 'Locked', status: 'Error' },
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
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {hasPermission("USER_UPDATE_STATUS") && (
                            <EditTwoTone
                                twoToneColor="#f57800"
                                style={{ cursor: "pointer", marginRight: 15 }}
                                onClick={() => {
                                    setDataUpdate(entity);
                                    setOpenModalUpdate(true);
                                }}
                            />
                        )}

                        {hasPermission("USER_DELETE") && (
                            <Popconfirm
                                placement="leftTop"
                                title={"Xác nhận xóa user"}
                                description={"Bạn có chắc chắn muốn xóa user này ?"}
                                onConfirm={() => handleDeleteUser(entity.id)}
                                okText="Xác nhận"
                                cancelText="Hủy"
                                okButtonProps={{ loading: isDeleteUser }}
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
        console.log('REFRESH TABLE USER', actionRef.current);
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                rowKey="id"
                search={{
                    collapseRender: false
                }}
                request={async (params, sort) => {
                    let sortParam = 'id,desc'; 

                    if (sort?.id) {
                        sortParam = `id,${sort.id === 'ascend' ? 'asc' : 'desc'}`;
                    } else if (sort?.createdAt) {
                        sortParam = `createdAt,${sort.createdAt === 'ascend' ? 'asc' : 'desc'}`;
                    }

                    const res = await getUsersAPI({
                        page: (params.current ?? 1) - 1,
                        size: params.pageSize ?? 5,
                        keyword: params.keyword,
                        role: params.role,
                        status: params.status,
                        sort: sortParam,
                    });

                    return {
                        data: res.data?.result ?? [],
                        total: res.data?.meta.total ?? 0,
                        success: true,
                    };
                }}
                pagination={{
                    showSizeChanger: true,
                }}
                headerTitle="User Management"
                toolBarRender={() => [
                    <Button
                        key="add"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
                    >
                        Add user
                    </Button>,
                ]}
            />

            <DetailUser
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <CreateUser
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <UpdateUser
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />

        </>
    );
};

export default TableUser;