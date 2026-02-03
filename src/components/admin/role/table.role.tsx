import { getRolesAPI } from '@/services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Tag } from 'antd';
import { useRef, useState } from 'react';
import { hasPermission } from '@/utils/permission';
import { PlusOutlined } from '@ant-design/icons';

type TSearchRole = {
    keyword?: string;
};

const TableRole = () => {
    const actionRef = useRef<ActionType>();
    const { message } = App.useApp();
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);
    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);

    const columns: ProColumns<IRole>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
            width: 80,
            hideInSearch: true,
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
    ];

    return (
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

                // xác định field + direction
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
                <Button
                    key="add"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setOpenModalCreate(true);
                    }}
                >
                    Add role
                </Button>,
            ]}
        />
    );
};

export default TableRole;