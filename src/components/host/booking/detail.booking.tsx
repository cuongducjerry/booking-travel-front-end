import { FORMATE_DATE_VN } from "@/services/helper";
import { Descriptions, Drawer, Tag } from "antd";
import dayjs from "dayjs";
import { formatVND } from "@/utils/format";
import { hasPermission } from "@/utils/permission";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IBookingDetail | null;
    setDataViewDetail: (v: IBookingDetail | null) => void;
}

const DetailBooking = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const isAdminView = hasPermission("BOOKING_LIST_ALL");

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    const statusColorMap: Record<string, string> = {
        NEW: "blue",
        PENDING: "orange",
        CONFIRMED: "green",
        CANCEL_REQUESTED: "gold",
        CANCELLED: "red",
        DONE: "purple",
    };

    return (
        <Drawer
            title="Booking details"
            width="55vw"
            onClose={onClose}
            open={openViewDetail}
        >
            {/* ================= BOOKING INFO ================= */}
            <Descriptions title="Booking information" bordered column={2}>
                <Descriptions.Item label="Booking ID">
                    {dataViewDetail?.id}
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                    <Tag color={statusColorMap[dataViewDetail?.status ?? ""]}>
                        {dataViewDetail?.status}
                    </Tag>
                </Descriptions.Item>

                {isAdminView && (
                    <Descriptions.Item label="User ID">
                        {dataViewDetail?.userId}
                    </Descriptions.Item>
                )}

                {isAdminView && (
                    <Descriptions.Item label="Property ID">
                        {dataViewDetail?.propertyId}
                    </Descriptions.Item>
                )}

                <Descriptions.Item label="Check-in">
                    {dataViewDetail?.checkIn
                        ? dayjs(dataViewDetail.checkIn).format(FORMATE_DATE_VN)
                        : "--"}
                </Descriptions.Item>

                <Descriptions.Item label="Check-out">
                    {dataViewDetail?.checkOut
                        ? dayjs(dataViewDetail.checkOut).format(FORMATE_DATE_VN)
                        : "--"}
                </Descriptions.Item>

                <Descriptions.Item label="Number of nights">
                    {dataViewDetail?.nights ?? "--"}
                </Descriptions.Item>

                <Descriptions.Item label="Price per night">
                    {dataViewDetail?.pricePerNightSnapshot
                        ? formatVND(dataViewDetail.pricePerNightSnapshot)
                        : "--"}
                </Descriptions.Item>

                <Descriptions.Item label="Total amount">
                    {dataViewDetail?.grossAmount
                        ? formatVND(dataViewDetail.grossAmount)
                        : "--"}
                </Descriptions.Item>

                <Descriptions.Item label="Commission fee">
                    {dataViewDetail?.commissionFee
                        ? formatVND(dataViewDetail.commissionFee)
                        : "--"}
                </Descriptions.Item>

                <Descriptions.Item label="Commission rate">
                    {dataViewDetail?.commissionRate
                        ? `${dataViewDetail.commissionRate}%`
                        : "--"}
                </Descriptions.Item>

                <Descriptions.Item label="Host income">
                    {dataViewDetail?.hostEarning
                        ? formatVND(dataViewDetail.hostEarning)
                        : "--"}
                </Descriptions.Item>
            </Descriptions>

            {/* ================= USER INFO ================= */}
            <Descriptions
                title="Customer information"
                bordered
                column={2}
                style={{ marginTop: 24 }}
            >
                <Descriptions.Item label="Guest's name">
                    {dataViewDetail?.userName}
                </Descriptions.Item>

                <Descriptions.Item label="Customer Email">
                    {dataViewDetail?.userEmail}
                </Descriptions.Item>
            </Descriptions>

            {/* ================= PROPERTY INFO ================= */}
            <Descriptions
                title="Accommodation information"
                bordered
                column={2}
                style={{ marginTop: 24 }}
            >
                <Descriptions.Item label="Property Name">
                    {dataViewDetail?.propertyName}
                </Descriptions.Item>
            </Descriptions>

            {/* ================= AUDIT INFO ================= */}
            <Descriptions
                bordered
                column={2}
                style={{ marginTop: 24 }}
            >
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
        </Drawer>
    );
};

export default DetailBooking;
