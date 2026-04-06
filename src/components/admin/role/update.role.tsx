import { App, Divider, Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { updateRoleAPI, getPermissionsAPI } from "@/services/api";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: IRole | null) => void;
    dataUpdate: IRole | null;
}

type FieldType = {
    name: string;
    description?: string;
    permissionIds: number[];
};

const UpdateRole = (props: IProps) => {
    const {
        openModalUpdate,
        setOpenModalUpdate,
        refreshTable,
        setDataUpdate,
        dataUpdate,
    } = props;

    const [form] = Form.useForm();
    const { message, notification } = App.useApp();

    const [isSubmit, setIsSubmit] = useState(false);
    const [permissions, setPermissions] = useState<IPermission[]>([]);

    // fetch permissions
    useEffect(() => {
        const fetchPermissions = async () => {
            const res = await getPermissionsAPI({ page: 0, size: 100 });
            setPermissions(res.data?.result ?? []);
        };
        fetchPermissions();
    }, []);

    // set default value when open modal
    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
                description: dataUpdate.description,
                permissionIds: dataUpdate.permissions?.map(p => p.id),
            });
        }
    }, [dataUpdate, form]);

    const onFinish = async (values: FieldType) => {
        if (!dataUpdate?.id) return;

        try {
            setIsSubmit(true);

            const payload = {
                id: dataUpdate.id,
                name: values.name,
                description: values.description,
                permissionIds: values.permissionIds,
            };

            await updateRoleAPI(payload);

            message.success("Role update successful");
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
            title="Update role"
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
                {/* NAME */}
                <Form.Item<FieldType>
                    label="Role name"
                    name="name"
                    rules={[{ required: true, message: "Please enter the role name" }]}
                >
                    <Input />
                </Form.Item>

                {/* DESCRIPTION */}
                <Form.Item<FieldType>
                    label="Description"
                    name="description"
                >
                    <Input.TextArea rows={3} />
                </Form.Item>

                {/* PERMISSIONS */}
                <Form.Item<FieldType>
                    label="Permissions"
                    name="permissionIds"
                    rules={[{ required: true, message: "Please select a permission" }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select permission"
                        optionFilterProp="label"
                    >
                        {permissions.map(p => (
                            <Select.Option
                                key={p.id}
                                value={p.id}
                                label={p.code}
                            >
                                {p.code}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateRole;