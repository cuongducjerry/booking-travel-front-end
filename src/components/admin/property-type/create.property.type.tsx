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
            message.success("Property Type created successfully");
            form.resetFields();
            setOpenModalCreate(false);
            refreshTable();
        } else {
            notification.error({
                message: "An error has occurred",
                description: res.message || "System error",
            });
        }

        setIsSubmit(false);
    };

    return (
        <Modal
            title="Add new Property Type"
            open={openModalCreate}
            onOk={() => form.submit()}
            onCancel={() => {
                setOpenModalCreate(false);
                form.resetFields();
            }}
            okText="Add new"
            cancelText="Cancel"
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
                        { required: true, message: "Please enter the Property Type name" },
                        { min: 3, message: "The name must have at least 3 characters" },
                    ]}
                >
                    <Input placeholder="Example: Apartment, House, Villa..." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreatePropertyType;