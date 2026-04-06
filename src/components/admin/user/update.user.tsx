import { App, Divider, Form, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { assignUserRoleAPI, updateUserStatusAPI, getRolesAPI } from "@/services/api";
import { useCurrentApp } from "@/components/context/app.context";
import { ROLE } from "@/utils/constants/global.var";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: IUserTable | null) => void;
    dataUpdate: IUserTable | null;
}

type FieldType = {
    roleId: number;
    status: 'PENDING' | 'APPROVED' | 'LOCK';
};

const UpdateUser = (props: IProps) => {
    const {
        openModalUpdate,
        setOpenModalUpdate,
        refreshTable,
        setDataUpdate,
        dataUpdate
    } = props;

    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();
    const { user } = useCurrentApp();

    const [roles, setRoles] = useState<IRole[]>([]);

    // fetch roles
    useEffect(() => {
        const fetchRoles = async () => {
            const res = await getRolesAPI({ page: 0, size: 100 });
            setRoles(res.data?.result ?? []);
        };
        fetchRoles();
    }, []);


    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                roleId: dataUpdate.role?.id,
                status: dataUpdate.status,
            });
        }
    }, [dataUpdate, form]);

    const onFinish = async (values: FieldType) => {
        if (!dataUpdate?.id) return;

        try {
            setIsSubmit(true);

            // Assign role
            await assignUserRoleAPI(dataUpdate.id, values.roleId);

            // Update status
            await updateUserStatusAPI(dataUpdate.id, values.status);

            message.success("User update successful");
            setOpenModalUpdate(false);
            setDataUpdate(null);
            form.resetFields();
            refreshTable();
        } catch (error: any) {
            notification.error({
                message: "Update failed",
                description: error?.message || "System error",
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Modal
            title="Update user"
            open={openModalUpdate}
            onOk={() => form.submit()}
            onCancel={() => {
                setOpenModalUpdate(false);
                setDataUpdate(null);
                form.resetFields();
            }}
            okText="Update"
            cancelText="Cancel"
            confirmLoading={isSubmit}
        >
            <Divider />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                {/* ROLE – only SUPER_ADMIN can see */}
                {user?.role === ROLE.SUPER_ADMIN && (
                    <Form.Item<FieldType>
                        label="Role"
                        name="roleId"
                        rules={[{ required: true, message: "Please select a role" }]}
                    >
                        <Select placeholder="Select role">
                            {roles
                                .filter(r => r.name !== ROLE.SUPER_ADMIN) 
                                .map(r => (
                                    <Select.Option key={r.id} value={r.id}>
                                        {r.name}
                                    </Select.Option>
                                ))}
                        </Select>
                    </Form.Item>
                )}

                {/* STATUS */}
                <Form.Item<FieldType>
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: "Please select a status" }]}
                >
                    <Select>
                        <Select.Option value="PENDING">Pending</Select.Option>
                        <Select.Option value="APPROVED">Approved</Select.Option>
                        <Select.Option value="LOCK">Lock</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateUser;
