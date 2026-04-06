import { App, Button, Form, Input, Modal, Space, Tag } from "antd";
import {
    approveContractAPI,
    rejectContractAPI,
} from "@/services/api";
import { hasPermission } from "@/utils/permission";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    dataUpdate: IHostContractTable | null;
    setDataUpdate: (v: IHostContractTable | null) => void;
    refreshTable: () => void;
}

const UpdateContract = (props: IProps) => {
    const {
        openModalUpdate,
        setOpenModalUpdate,
        dataUpdate,
        setDataUpdate,
        refreshTable,
    } = props;

    const [form] = Form.useForm();
    const { message } = App.useApp();

    const onClose = () => {
        setOpenModalUpdate(false);
        setDataUpdate(null);
        form.resetFields();
    };

    /* ================= APPROVE ================= */
    const handleApprove = async () => {
        if (!dataUpdate) return;

        await approveContractAPI(dataUpdate.id);
        message.success("Contract approved successfully");
        refreshTable();
        onClose();
    };

    /* ================= REJECT ================= */
    const handleReject = async () => {
        if (!dataUpdate) return;

        const { reason } = await form.validateFields();
        await rejectContractAPI(dataUpdate.id, reason);

        message.success("The contract was successfully rejected");
        refreshTable();
        onClose();
    };

    const statusColorMap: Record<string, string> = {
        DRAFT: "default",
        PENDING: "orange",
        ACTIVE: "green",
        SUSPENDED: "volcano",
        EXPIRED: "gold",
        TERMINATED: "red",
    };

    const canUpdate = dataUpdate?.status === "PENDING";

    return (
        <Modal
            title="Update contract status"
            open={openModalUpdate}
            onCancel={onClose}
            footer={null}
            width={500}
        >
            <p>
                Contract Code: <b>{dataUpdate?.contractCode}</b>
            </p>

            <p>
                Current status:{" "}
                <Tag color={statusColorMap[dataUpdate?.status ?? ""]}>
                    {dataUpdate?.status}
                </Tag>
            </p>

            {/* REJECT REASON */}
            <Form form={form} layout="vertical">
                {canUpdate && hasPermission("CONTRACT_REJECT") && (
                    <Form.Item
                        label="Reason for refusal"
                        name="reason"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the reason for refusal",
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Enter the reason for rejecting the contract"
                        />
                    </Form.Item>
                )}
            </Form>

            <Space style={{ marginTop: 24 }}>
                {/* APPROVE */}
                {canUpdate && hasPermission("CONTRACT_APPROVE") && (
                    <Button type="primary" onClick={handleApprove}>
                        Approve
                    </Button>
                )}

                {/* REJECT */}
                {canUpdate && hasPermission("CONTRACT_REJECT") && (
                    <Button danger onClick={handleReject}>
                        Reject
                    </Button>
                )}
            </Space>
        </Modal>
    );
};

export default UpdateContract;
