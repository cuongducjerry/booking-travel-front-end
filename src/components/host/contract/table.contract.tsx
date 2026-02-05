import { getMyContractsAPI, getMyPropertiesInActiveAPI } from '@/services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { hasPermission } from '@/utils/permission';
import DetailContract from 'components/host/contract/detail.contract';
import CreateHostContract from './create.contract';
import { PlusOutlined } from '@ant-design/icons';

type TSearch = {
    keyword?: string;
    status?: string;
};

const HostTableContract = () => {
    const actionRef = useRef<ActionType>();
    const { message } = App.useApp();
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IHostContractTable | null>(null);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [properties, setProperties] = useState<IPropertyDetail[]>([]);

    useEffect(() => {
        const fetchProperties = async () => {
            const res = await getMyPropertiesInActiveAPI();

            setProperties(res.data ?? []);
        };

        fetchProperties();
    }, []);

    const columns: ProColumns<IHostContractTable>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                const canView = hasPermission('CONTRACT_VIEW_PERSONAL');

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
            title: 'Contract Code',
            dataIndex: 'contractCode',
            hideInSearch: true,
            render: (_, entity) =>
                hasPermission('CONTRACT_VIEW') ? (
                    <a>{entity.contractCode}</a>
                ) : (
                    <span>{entity.contractCode}</span>
                ),
        },

        {
            title: 'Host',
            dataIndex: 'hostName',
            hideInSearch: true,
        },

        {
            title: 'Status',
            dataIndex: 'status',
            valueType: 'select',
            valueEnum: {
                DRAFT: { text: 'Draft', status: 'Default' },
                ACTIVE: { text: 'Active', status: 'Success' },
                EXPIRED: { text: 'Expired', status: 'Warning' },
                TERMINATED: { text: 'Terminated', status: 'Error' },
            },
        },

        {
            title: 'Commission (%)',
            dataIndex: 'commissionRate',
            hideInSearch: true,
            render: (_, record) => `${record.commissionRate}%`,
        },

        {
            title: 'Start Date',
            dataIndex: 'startDate',
            valueType: 'date',
            hideInSearch: true,
        },

        {
            title: 'End Date',
            dataIndex: 'endDate',
            valueType: 'date',
            hideInSearch: true,
        },

        {
            title: 'Properties',
            dataIndex: 'properties',
            hideInSearch: true,
            render: (_, record) => (
                <>
                    {record.properties?.map(p => (
                        <Tag key={p.id}>{p.title}</Tag>
                    ))}
                </>
            ),
        },

        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            sorter: true,
            hideInSearch: true,
        },
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IHostContractTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                rowKey="id"
                search={{
                    collapseRender: false,
                }}
                request={async (params, sort) => {
                    let sortParam = 'id,desc';

                    if (sort?.id) {
                        sortParam = `id,${sort.id === 'ascend' ? 'asc' : 'desc'}`;
                    } else if (sort?.createdAt) {
                        sortParam = `createdAt,${sort.createdAt === 'ascend' ? 'asc' : 'desc'}`;
                    }

                    const res = await getMyContractsAPI({
                        page: (params.current ?? 1) - 1,
                        size: params.pageSize ?? 5,
                        contractCode: params.keyword,
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
                headerTitle="My Contracts"
                toolBarRender={() => {
                    const canCreateContract =
                        hasPermission("CONTRACT_REQUEST") &&
                        hasPermission("PROPERTY_LIST_OWN");

                    return [
                        canCreateContract && (
                            <Button
                                key="add"
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setOpenModalCreate(true)}
                            >
                                Add contract
                            </Button>
                        )
                    ];
                }}
            />

            <DetailContract
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <CreateHostContract
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
                properties={properties}
            />

        </>
    );
};

export default HostTableContract;
