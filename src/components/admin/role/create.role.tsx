import { createRoleAPI, getPermissionsAPI } from "@/services/api";
import { App, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd/lib";
import { useEffect, useState } from "react";

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    name: string;
    description?: string;
    permissionIds: number[];
};

const CreateRole = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;

    const [form] = Form.useForm();
    const { message, notification } = App.useApp();

    const [isSubmit, setIsSubmit] = useState(false);
    const [permissions, setPermissions] = useState<IPermission[]>([]);

    useEffect(() => {
        const fetchPermissions = async () => {
            const res = await getPermissionsAPI({ page: 0, size: 100 });
            setPermissions(res.data?.result ?? []);
        };
        fetchPermissions();
    }, []);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);

        const payload = {
            name: values.name,
            description: values.description,
            permissionIds: values.permissionIds,
        };

        const res = await createRoleAPI(payload);

        if (res.data && res.statusCode === 201) {
            message.success('Tạo role thành công');
            form.resetFields();
            setOpenModalCreate(false);
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message || 'Lỗi hệ thống',
            });
        }

        setIsSubmit(false);
    };

    return (
        <Modal
            title="Thêm mới role"
            open={openModalCreate}
            onOk={() => form.submit()}
            onCancel={() => {
                setOpenModalCreate(false);
                form.resetFields();
            }}
            okText="Tạo mới"
            cancelText="Hủy"
            confirmLoading={isSubmit}
        >
            <Divider />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Tên role"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên role' }]}
                >
                    <Input placeholder="VD: ADMIN_BUSINESS" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Mô tả"
                    name="description"
                >
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Permissions"
                    name="permissionIds"
                    rules={[{ required: true, message: 'Vui lòng chọn permission' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn permission"
                        optionFilterProp="label"
                    >
                        {permissions.map(p => (
                            <Select.Option key={p.id} value={p.id} label={p.code}>
                                {p.code}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateRole;