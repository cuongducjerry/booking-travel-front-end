import { App, Button, Form, Input, Modal, Space, Tag } from "antd";
import {
  decidePropertyAPI,
  approveDeletePropertyAPI,
} from "@/services/api";
import { hasPermission } from "@/utils/permission";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  dataUpdate: IPropertyTable | null;
  setDataUpdate: (v: IPropertyTable | null) => void;
  refreshTable: () => void;
}

const UpdateProperty = (props: IProps) => {
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

  if (!dataUpdate) return null;

  const canDecide = dataUpdate.status === "PENDING";
  const canApproveDelete = dataUpdate.status === "DELETE_PENDING";

  const statusColorMap: Record<string, string> = {
    DRAFT: "default",
    PENDING: "orange",
    APPROVED: "green",
    REJECTED: "red",
    DELETE_PENDING: "volcano",
  };

  /* ================= APPROVE ================= */
  const handleApprove = async () => {
    await decidePropertyAPI(dataUpdate.id, { decision: "APPROVED" });
    message.success("Property approval successful");
    refreshTable();
    onClose();
  };

  /* ================= REJECT ================= */
  const handleReject = async () => {
    const { reason } = await form.validateFields();
    await decidePropertyAPI(dataUpdate.id, {
      decision: "REJECTED",
      reason,
    });
    message.success("Property rejection successful");
    refreshTable();
    onClose();
  };

  /* ================= REQUEST EDIT ================= */
  const handleRequestEdit = async () => {
    await decidePropertyAPI(dataUpdate.id, { decision: "DRAFT" });
    message.success("Have requested the host to edit the property");
    refreshTable();
    onClose();
  };

  /* ================= APPROVE DELETE ================= */
  const handleApproveDelete = async () => {
    await approveDeletePropertyAPI(dataUpdate.id);
    message.success("Property deletion process successful");
    refreshTable();
    onClose();
  };

  return (
    <Modal
      title="Admin updates Property"
      open={openModalUpdate}
      onCancel={onClose}
      footer={null}
      width={520}
    >
      <p>
        Property ID: <b>{dataUpdate.id}</b>
      </p>

      <p>
        Title: <b>{dataUpdate.title}</b>
      </p>

      <p>
        Current status:{" "}
        <Tag color={statusColorMap[dataUpdate.status]}>
          {dataUpdate.status}
        </Tag>
      </p>

      {/* REJECT REASON */}
      <Form form={form} layout="vertical">
        {canDecide && hasPermission("PROPERTY_APPROVE") && (
          <Form.Item
            label="Reason for refusal"
            name="reason"
            rules={[
              { required: true, message: "Please enter the reason for refusal" },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        )}
      </Form>

      <Space style={{ marginTop: 24 }}>
        {/* APPROVE */}
        {canDecide && hasPermission("PROPERTY_APPROVE") && (
          <Button type="primary" onClick={handleApprove}>
            Approve
          </Button>
        )}

        {/* REJECT */}
        {canDecide && hasPermission("PROPERTY_APPROVE") && (
          <Button danger onClick={handleReject}>
            Reject
          </Button>
        )}

        {/* REQUEST EDIT */}
        {canDecide && hasPermission("PROPERTY_APPROVE") && (
          <Button onClick={handleRequestEdit}>
            Request Edit
          </Button>
        )}

        {/* APPROVE DELETE */}
        {canApproveDelete &&
          hasPermission("PROPERTY_DELETE_APPROVE") && (
            <Button danger type="primary" onClick={handleApproveDelete}>
              Approve Delete
            </Button>
          )}
      </Space>
    </Modal>
  );
};

export default UpdateProperty;
