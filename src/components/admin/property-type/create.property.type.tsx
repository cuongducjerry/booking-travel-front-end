import { createPropertyTypeAPI } from "@/services/api";
import { App, Divider, Form, Input, Modal } from "antd";
import type { FormProps } from "antd/lib";
import { useState } from "react";

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    name: string;
};

const CreatePropertyType = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const [form] = Form.useForm<FieldType>();

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsSubmit(true);

        const res = await createPropertyTypeAPI({
            name: values.name,
        });

        if (res.data && res.statusCode === 201) {
            message.success("Tạo mới Property Type thành công");
            form.resetFields();
            setOpenModalCreate(false);
            refreshTable();
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message || "Lỗi hệ thống",
            });
        }

        setIsSubmit(false);
    };

    return (
        <Modal
            title="Thêm mới Property Type"
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
                    label="Tên Property Type"
                    name="name"
                    rules={[
                        { required: true, message: "Vui lòng nhập tên Property Type" },
                        { min: 3, message: "Tên phải có ít nhất 3 ký tự" },
                    ]}
                >
                    <Input placeholder="Ví dụ: Apartment, House, Villa..." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreatePropertyType;