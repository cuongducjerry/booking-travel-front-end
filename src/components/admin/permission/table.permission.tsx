import { getPermissionsAPI } from '@/services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Tag } from 'antd';
import { useRef } from 'react';
import { hasPermission } from '@/utils/permission';

type TSearchPermission = {
    keyword?: string;
};

const TablePermission = () => {
    const actionRef = useRef<ActionType>();
    const { message } = App.useApp();

    const columns: ProColumns<IPermission>[] = [
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
            title: 'Permission Code',
            dataIndex: 'code',
            render: (_, record) => (
                <Tag color="purple">{record.code}</Tag>
            ),
            hideInSearch: true,
        },
    ];

    return (
        <ProTable<IPermission, TSearchPermission>
            headerTitle="Permission Management"
            rowKey="id"
            actionRef={actionRef}
            columns={columns}
            search={{ collapseRender: false }}
            pagination={{ showSizeChanger: true }}
            request={async (params, sort) => {

                if (!hasPermission('PERMISSION_LIST_ALL')) {
                    message.error('Bạn không có quyền xem permission');
                    return {
                        data: [],
                        total: 0,
                        success: false,
                    };
                }

                let sortParam = 'id,desc';
                if (sort?.id) {
                    sortParam = `id,${sort.id === 'ascend' ? 'asc' : 'desc'}`;
                }

                const res = await getPermissionsAPI({
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
        />
    );
};

export default TablePermission;