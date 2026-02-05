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
        message.success("Duyệt hợp đồng thành công");
        refreshTable();
        onClose();
    };

    /* ================= REJECT ================= */
    const handleReject = async () => {
        if (!dataUpdate) return;

        const { reason } = await form.validateFields();
        await rejectContractAPI(dataUpdate.id, reason);

        message.success("Từ chối hợp đồng thành công");
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
            title="Cập nhật trạng thái hợp đồng"
            open={openModalUpdate}
            onCancel={onClose}
            footer={null}
            width={500}
        >
            <p>
                Contract Code: <b>{dataUpdate?.contractCode}</b>
            </p>

            <p>
                Trạng thái hiện tại:{" "}
                <Tag color={statusColorMap[dataUpdate?.status ?? ""]}>
                    {dataUpdate?.status}
                </Tag>
            </p>

            {/* REJECT REASON */}
            <Form form={form} layout="vertical">
                {canUpdate && hasPermission("CONTRACT_REJECT") && (
                    <Form.Item
                        label="Lý do từ chối"
                        name="reason"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập lý do từ chối",
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Nhập lý do từ chối hợp đồng"
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
