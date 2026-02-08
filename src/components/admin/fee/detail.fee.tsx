import { FORMATE_DATE_VN } from "@/services/helper";
import { Badge, Descriptions, Drawer, Tag } from "antd";
import dayjs from "dayjs";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IResHostFee | null;
    setDataViewDetail: (v: IResHostFee | null) => void;
}

const DetailFee = (props: IProps) => {
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

    const statusBadgeMap: Record<string, any> = {
        PENDING: "processing",
        PAID: "success",
        OVERDUE: "error",
    };

    return (
        <Drawer
            title="Fee Detail"
            width="50vw"
            onClose={onClose}
            open={openViewDetail}
        >
            {/* BASIC */}
            <Descriptions bordered column={2} title="Basic Information">
                <Descriptions.Item label="Fee ID">
                    {dataViewDetail?.id}
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                    <Badge
                        status={statusBadgeMap[dataViewDetail?.status ?? "PENDING"]}
                        text={dataViewDetail?.status}
                    />
                </Descriptions.Item>

                <Descriptions.Item label="Booking ID" span={2}>
                    {dataViewDetail?.bookingId}
                </Descriptions.Item>
            </Descriptions>

            <br />

            {/* AMOUNT */}
            <Descriptions bordered column={2} title="Fee Information">
                <Descriptions.Item label="Amount">
                    {dataViewDetail
                        ? dataViewDetail.amount.toLocaleString()
                        : "--"}
                </Descriptions.Item>

                <Descriptions.Item label="Rate">
                    {dataViewDetail ? `${dataViewDetail.rate}%` : "--"}
                </Descriptions.Item>
            </Descriptions>

            <br />

            {/* TIME */}
            <Descriptions bordered column={2} title="Time Information">
                <Descriptions.Item label="Due At">
                    {dataViewDetail?.dueAt
                        ? dayjs(dataViewDetail.dueAt).format(FORMATE_DATE_VN)
                        : "--"}
                </Descriptions.Item>

                <Descriptions.Item label="Paid At">
                    {dataViewDetail?.paidAt
                        ? dayjs(dataViewDetail.paidAt).format(FORMATE_DATE_VN)
                        : "--"}
                </Descriptions.Item>
            </Descriptions>

            <br />

            {/* STATUS EXTRA */}
            {dataViewDetail?.status === "PAID" && (
                <>
                    <Descriptions bordered column={1} title="Payment Status">
                        <Descriptions.Item label="Status">
                            <Tag color="green">PAID</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                    <br />
                </>
            )}

            {dataViewDetail?.status === "OVERDUE" && (
                <>
                    <Descriptions bordered column={1} title="Overdue Status">
                        <Descriptions.Item label="Status">
                            <Tag color="red">OVERDUE</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                    <br />
                </>
            )}
        </Drawer>
    );
};

export default DetailFee;