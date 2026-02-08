import { App, Button, Form, Input, Modal, Space, Tag } from "antd";
import { useEffect, useState } from "react";
import { hasPermission } from "@/utils/permission";
import { markPaidPayoutAPI, markRejectedPayoutAPI } from "@/services/api";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    dataUpdate: IResHostPayout | null;
    setDataUpdate: (v: IResHostPayout | null) => void;
    refreshTable: () => void;
}

type ActionType = "PAID" | "REJECT" | null;

const UpdatePayout = (props: IProps) => {
    const {
        openModalUpdate,
        setOpenModalUpdate,
        dataUpdate,
        setDataUpdate,
        refreshTable,
    } = props;

    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [actionType, setActionType] = useState<ActionType>(null);

    const onClose = () => {
        setOpenModalUpdate(false);
        setDataUpdate(null);
        setActionType(null);
        form.resetFields();
    };

    useEffect(() => {
        form.resetFields();
    }, [actionType]);

    const onFinish = async (values: any) => {
        if (!dataUpdate || !actionType) return;

        if (actionType === "PAID") {
            await markPaidPayoutAPI(dataUpdate.id, values.transactionRef);
            message.success("Đã mark payout là PAID");
        }

        if (actionType === "REJECT") {
            await markRejectedPayoutAPI(dataUpdate.id, values.reason);
            message.success("Reject payout thành công");
        }

        refreshTable();
        onClose();
    };

    const statusColorMap = {
        PENDING: "orange",
        PAID: "green",
        REJECTED: "red",
    } as const;

    const canUpdate = dataUpdate?.status === "PENDING";

    return (
        <Modal
            title="Update Payout"
            open={openModalUpdate}
            onCancel={onClose}
            footer={null}
            width={480}
        >
            <p>
                Payout ID: <b>{dataUpdate?.id}</b>
            </p>

            <p>
                Trạng thái hiện tại:{" "}
                <Tag color={statusColorMap[dataUpdate?.status ?? "PENDING"]}>
                    {dataUpdate?.status}
                </Tag>
            </p>

            <p>
                Net Amount:{" "}
                <b>{dataUpdate?.netAmount.toLocaleString()}</b>
            </p>

            <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* MARK PAID */}
                {actionType === "PAID" && (
                    <Form.Item
                        label="Transaction Reference"
                        name="transactionRef"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mã giao dịch",
                            },
                        ]}
                    >
                        <Input placeholder="VD: VCB_20240208_001" />
                    </Form.Item>
                )}

                {/* REJECT */}
                {actionType === "REJECT" && (
                    <Form.Item
                        label="Reject Reason"
                        name="reason"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập lý do từ chối payout",
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Nhập lý do từ chối payout"
                        />
                    </Form.Item>
                )}

                <Space style={{ marginTop: 24 }}>
                    {/* CHỌN ACTION */}
                    {canUpdate &&
                        !actionType &&
                        hasPermission("PAYOUT_MARK_PAID") && (
                            <Button
                                type="primary"
                                onClick={() => setActionType("PAID")}
                            >
                                Mark Paid
                            </Button>
                        )}

                    {canUpdate &&
                        !actionType &&
                        hasPermission("PAYOUT_MARK_REJECTED") && (
                            <Button
                                danger
                                onClick={() => setActionType("REJECT")}
                            >
                                Reject
                            </Button>
                        )}

                    {/* CONFIRM */}
                    {actionType && (
                        <>
                            <Button type="primary" htmlType="submit">
                                Confirm
                            </Button>
                            <Button onClick={() => setActionType(null)}>
                                Cancel
                            </Button>
                        </>
                    )}
                </Space>
            </Form>
        </Modal>
    );
};

export default UpdatePayout;

