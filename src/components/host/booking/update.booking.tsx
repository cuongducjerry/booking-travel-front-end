import {
    confirmBookingAPI,
    cancelBookingAPI,
    doneBookingAPI,
} from "@/services/api";
import { hasPermission } from "@/utils/permission";
import { App, Button, Modal, Space, Tag } from "antd";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    dataUpdate: IBookingDetail | null;
    setDataUpdate: (v: IBookingDetail | null) => void;
    refreshTable: () => void;
}

const UpdateBooking = (props: IProps) => {
    const {
        openModalUpdate,
        setOpenModalUpdate,
        dataUpdate,
        setDataUpdate,
        refreshTable,
    } = props;

    const { message } = App.useApp();

    const onClose = () => {
        setOpenModalUpdate(false);
        setDataUpdate(null);
    };

    const handleConfirm = async () => {
        if (!dataUpdate) return;
        await confirmBookingAPI(dataUpdate.id);
        message.success("Booking confirmed");
        refreshTable();
        onClose();
    };

    const handleCancel = async () => {
        if (!dataUpdate) return;
        await cancelBookingAPI(dataUpdate.id);
        message.success("Booking cancelled successfully");
        refreshTable();
        onClose();
    };

    const handleDone = async () => {
        if (!dataUpdate) return;
        await doneBookingAPI(dataUpdate.id);
        message.success("Booking is complete");
        refreshTable();
        onClose();
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
        <Modal
            title="Update booking status"
            open={openModalUpdate}
            onCancel={onClose}
            footer={null}
            width={500}
        >
            <p>
                Booking ID: <b>{dataUpdate?.id}</b>
            </p>

            <p>
                Current status:{" "}
                <Tag color={statusColorMap[dataUpdate?.status ?? ""]}>
                    {dataUpdate?.status}
                </Tag>
            </p>

            <Space style={{ marginTop: 24 }}>
                {/* CONFIRM */}
                {hasPermission("BOOKING_CONFIRM") &&
                    dataUpdate?.status === "PENDING" && (
                        <Button type="primary" onClick={handleConfirm}>
                            Confirm
                        </Button>
                    )}

                {/* CANCEL */}
                {hasPermission("BOOKING_CANCEL") &&
                    !["CANCELLED", "DONE"].includes(
                        dataUpdate?.status ?? ""
                    ) && (
                        <Button danger onClick={handleCancel}>
                            Cancel
                        </Button>
                    )}

                {/* DONE */}
                {hasPermission("BOOKING_DONE") &&
                    dataUpdate?.status === "CONFIRMED" && (
                        <Button type="default" onClick={handleDone}>
                            Done
                        </Button>
                    )}
            </Space>
        </Modal>
    );
};

export default UpdateBooking;
