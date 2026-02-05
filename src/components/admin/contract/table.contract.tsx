import { getAllContractsAPI } from '@/services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Tag } from 'antd';
import { useRef, useState } from 'react';
import { hasPermission } from '@/utils/permission';
import DetailContract from '@/components/host/contract/detail.contract';
import { EditTwoTone } from '@ant-design/icons';
import UpdateContract from './update.contract';

type TSearch = {
    contractCode: string;
    status?: string;
};

const AdminTableContract = () => {
    const actionRef = useRef<ActionType>();
    const { message } = App.useApp();

    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState<IHostContractTable | null>(null);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IHostContractTable | null>(null);

    const columns: ProColumns<IHostContractTable>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
            hideInSearch: true,
            render: (_, entity) =>
                hasPermission('CONTRACT_DETAIL_ALL') ? (
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
                ),
        },

        {
            title: 'Contract Code',
            dataIndex: 'contractCode',
            render: (_, entity) => <strong>{entity.contractCode}</strong>,
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
                PENDING: { text: 'Pending', status: 'Processing' },
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
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            sorter: true,
            hideInSearch: true,
        },

        {
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {hasPermission(["CONTRACT_APPROVE", "CONTRACT_REJECT"], "ALL") && (
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
        }

    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IHostContractTable, TSearch>
                actionRef={actionRef}
                columns={columns}
                rowKey="id"
                headerTitle="All Contracts"
                search={{ 
                    labelWidth: 120,
                    collapseRender: false 
                }}
                pagination={{ showSizeChanger: true }}
                request={async (params, sort) => {
                    let sortParam = 'id,desc';

                    if (sort?.id) {
                        sortParam = `id,${sort.id === 'ascend' ? 'asc' : 'desc'}`;
                    } else if (sort?.createdAt) {
                        sortParam = `createdAt,${sort.createdAt === 'ascend' ? 'asc' : 'desc'
                            }`;
                    }

                    const res = await getAllContractsAPI({
                        page: (params.current ?? 1) - 1,
                        size: params.pageSize ?? 10,
                        sort: sortParam,
                        contractCode: params.contractCode,
                        status: params.status
                    });

                    return {
                        data: res.data?.result ?? [],
                        total: res.data?.meta.total ?? 0,
                        success: true,
                    };
                }}
            />

            <DetailContract
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <UpdateContract
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />

        </>
    );
};

export default AdminTableContract;