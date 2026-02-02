import { getUsersAPI } from '@/services/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef } from 'react';

type TSearch = {
    keyword?: string;
    role?: string;
    status?: 'PENDING' | 'APPROVED' | 'LOCK';
};

const TableUser = () => {
    const actionRef = useRef<ActionType>();

    const columns: ProColumns<IUserTable>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            hideInSearch: true,
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
            sorter: true,
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
    ];

    return (
        <ProTable<IUserTable, TSearch>
            columns={columns}
            actionRef={actionRef}
            rowKey="id"
            request={async (params, sort) => {
                const res = await getUsersAPI({
                    page: (params.current ?? 1) - 1,
                    size: params.pageSize ?? 5,
                    keyword: params.keyword,
                    role: params.role,
                    status: params.status,
                    sort: sort?.createdAt
                        ? `createdAt,${sort.createdAt === 'ascend' ? 'asc' : 'desc'}`
                        : 'createdAt,desc',
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
                >
                    Add user
                </Button>,
            ]}
        />
    );
};

export default TableUser;