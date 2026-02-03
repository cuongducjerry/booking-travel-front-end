import { createUserAPI, getRolesAPI } from "@/services/api";
import { ROLE } from "@/utils/constants/global.var";
import { App, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd/lib";

import { useEffect, useState } from "react";

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    fullName: string;
    password: string;
    email: string;
    phone: string;
    address: string;
    age: number;
    roleId: number;
};

const CreateUser = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const [form] = Form.useForm();

    const [roles, setRoles] = useState<IRole[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            const res = await getRolesAPI({ page: 0, size: 100 });
            setRoles(res.data?.result ?? []);
        };
        fetchRoles();
    }, []);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);

        const payload: ICreateUserReq = {
            fullName: values.fullName,
            email: values.email,
            password: values.password,
            phone: values.phone,
            address: values.address,
            age: values.age,
            role: {
                id: values.roleId,
            },
        };

        const res = await createUserAPI(payload);
        if (res.data && res.statusCode === 201) {
            message.success('Tạo mới user thành công');
            form.resetFields();
            setOpenModalCreate(false);
            refreshTable();
        }
        else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message || 'Lỗi hệ thống',
            });
        }
        setIsSubmit(false);
    }


    return (
        <>
            <Modal
                title="Thêm mới người dùng"
                open={openModalCreate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenModalCreate(false);
                    form.resetFields();
                }}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
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
                        label="Tên hiển thị"
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Tuổi"
                        name="age"
                        rules={[{ required: true, message: 'Vui lòng nhập tuổi' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Role"
                        name="roleId"
                        rules={[{ required: true, message: 'Vui lòng chọn role' }]}
                    >
                        <Select placeholder="Chọn role">
                            {roles
                                .filter(role => role.name !== ROLE.SUPER_ADMIN)
                                .map(role => (
                                    <Select.Option key={role.id} value={role.id}>
                                        {role.name}
                                    </Select.Option>
                                ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )

}

export default CreateUser;