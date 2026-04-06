import { App, Button, Form, Modal, Space, Tag } from "antd";
import { useEffect, useState } from "react";
import { hasPermission } from "@/utils/permission";
import { updateFeeStatusAPI } from "@/services/api";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    dataUpdate: IResHostFee | null;
    setDataUpdate: (v: IResHostFee | null) => void;
    refreshTable: () => void;
}

type ActionType = "PAID" | "OVERDUE" | null;

const UpdateFee = (props: IProps) => {
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

    const onFinish = async () => {
        if (!dataUpdate || !actionType) return;

        try {
            await updateFeeStatusAPI(dataUpdate.id, actionType);
            message.success(`The fee has been updated to ${actionType}`);
            refreshTable();
            onClose();
        } catch (err: any) {
            message.error(err?.response?.data?.message || "Fee update failed");
        }
    };

    const statusColorMap = {
        PENDING: "orange",
        PAID: "green",
        OVERDUE: "red",
    } as const;

    const canUpdate =
        dataUpdate?.status !== "PAID" &&
        hasPermission("FEE_UPDATE");

    return (
        <Modal
            title="Update Fee"
            open={openModalUpdate}
            onCancel={onClose}
            footer={null}
            width={420}
        >
            <p>
                Fee ID: <b>{dataUpdate?.id}</b>
            </p>

            <p>
                Current status:{" "}
                <Tag color={statusColorMap[dataUpdate?.status ?? "PENDING"]}>
                    {dataUpdate?.status}
                </Tag>
            </p>

            <p>
                Amount:{" "}
                <b>{dataUpdate?.amount.toLocaleString()}</b>
            </p>

            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Space style={{ marginTop: 24 }}>
                    {/* SELECT ACTION */}
                    {canUpdate &&
                        !actionType &&
                        dataUpdate?.status !== "PAID" && (
                            <>
                                {dataUpdate?.status !== "OVERDUE" && (
                                    <Button
                                        danger
                                        onClick={() => setActionType("OVERDUE")}
                                    >
                                        Mark Overdue
                                    </Button>
                                )}

                                <Button
                                    type="primary"
                                    onClick={() => setActionType("PAID")}
                                >
                                    Mark Paid
                                </Button>
                            </>
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

export default UpdateFee;
