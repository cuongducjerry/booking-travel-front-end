import { FORMATE_DATE_VN } from "@/services/helper";
import { Badge, Descriptions, Drawer, Table, Tag } from "antd";
import dayjs from "dayjs";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IResHostPayout | null;
    setDataViewDetail: (v: IResHostPayout | null) => void;
}

const DetailPayout = (props: IProps) => {
    const {
        openViewDetail,
        setOpenViewDetail,
        dataViewDetail,
        setDataViewDetail,
    } = props;

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    const statusBadgeMap: any = {
        PENDING: "processing",
        PAID: "success",
        REJECTED: "error",
    };

    const itemColumns = [
        {
            title: "Item ID",
            dataIndex: "id",
        },
        {
            title: "Booking ID",
            dataIndex: "bookingId",
        },
        {
            title: "Booking Amount",
            dataIndex: "bookingAmount",
            render: (v: number) => v.toLocaleString(),
        },
        {
            title: "Commission Fee",
            dataIndex: "commissionFee",
            render: (v: number) => v.toLocaleString(),
        },
        {
            title: "Net Amount",
            dataIndex: "netAmount",
            render: (v: number) => (
                <Tag color="green">{v.toLocaleString()}</Tag>
            ),
        },
    ];

    return (
        <Drawer
            title="Payout Detail"
            width="60vw"
            onClose={onClose}
            open={openViewDetail}
        >
            {/* BASIC */}
            <Descriptions bordered column={2} title="Basic Information">
                <Descriptions.Item label="Payout ID">
                    {dataViewDetail?.id}
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                    <Badge
                        status={statusBadgeMap[dataViewDetail?.status ?? "PENDING"]}
                        text={dataViewDetail?.status}
                    />
                </Descriptions.Item>

                <Descriptions.Item label="Host ID">
                    {dataViewDetail?.hostId}
                </Descriptions.Item>

                <Descriptions.Item label="Contract ID">
                    {dataViewDetail?.contractId}
                </Descriptions.Item>
            </Descriptions>

            <br />

            {/* PERIOD */}
            <Descriptions bordered column={2} title="Payout Period">
                <Descriptions.Item label="From">
                    {dataViewDetail?.periodFrom
                        ? dayjs(dataViewDetail.periodFrom).format(FORMATE_DATE_VN)
                        : "--"}
                </Descriptions.Item>

                <Descriptions.Item label="To">
                    {dataViewDetail?.periodTo
                        ? dayjs(dataViewDetail.periodTo).format(FORMATE_DATE_VN)
                        : "--"}
                </Descriptions.Item>
            </Descriptions>

            <br />

            {/* AMOUNT */}
            <Descriptions bordered column={2} title="Amount Information">
                <Descriptions.Item label="Gross Amount">
                    {dataViewDetail
                        ? dataViewDetail.grossAmount.toLocaleString()
                        : "--"}
                </Descriptions.Item>

                <Descriptions.Item label="Commission Fee">
                    {dataViewDetail
                        ? dataViewDetail.commissionFee.toLocaleString()
                        : "--"}
                </Descriptions.Item>

                <Descriptions.Item label="Net Amount" span={2}>
                    <Tag color="green">
                        {dataViewDetail
                            ? dataViewDetail.netAmount.toLocaleString()
                            : "--"}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>

            <br />

            {/* AUDIT */}
            <Descriptions bordered column={2} title="Audit Information">
                <Descriptions.Item label="Created At">
                    {dataViewDetail?.createdAt
                        ? dayjs(dataViewDetail.createdAt).format(FORMATE_DATE_VN)
                        : "--"}
                </Descriptions.Item>

                <Descriptions.Item label="Updated At">
                    {dataViewDetail?.updatedAt
                        ? dayjs(dataViewDetail.updatedAt).format(FORMATE_DATE_VN)
                        : "--"}
                </Descriptions.Item>
            </Descriptions>

            <br />

            {/* PAID INFO */}
            {dataViewDetail?.status === "PAID" && (
                <>
                    <Descriptions bordered column={2} title="Payment Information">
                        <Descriptions.Item label="Paid At">
                            {dataViewDetail?.paidAt
                                ? dayjs(dataViewDetail.paidAt).format(FORMATE_DATE_VN)
                                : "--"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Transaction Ref">
                            <Tag color="green">{dataViewDetail?.transactionRef}</Tag>
                        </Descriptions.Item>
                    </Descriptions>

                    <br />
                </>
            )}

            {/* REJECT INFO */}
            {dataViewDetail?.status === "REJECTED" && (
                <>
                    <Descriptions bordered column={1} title="Reject Information">
                        <Descriptions.Item label="Rejected At">
                            {dataViewDetail?.rejectedAt
                                ? dayjs(dataViewDetail.rejectedAt).format(FORMATE_DATE_VN)
                                : "--"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Reject Reason">
                            <Tag color="red">{dataViewDetail?.rejectReason}</Tag>
                        </Descriptions.Item>
                    </Descriptions>

                    <br />
                </>
            )}

            <br />

            {/* ITEMS */}
            <Table
                rowKey="id"
                title={() => "Payout Items"}
                columns={itemColumns}
                dataSource={dataViewDetail?.items || []}
                pagination={false}
            />
        </Drawer>
    );
};

export default DetailPayout;
