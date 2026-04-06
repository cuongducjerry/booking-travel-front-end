import { App, Divider, Form, Input, Modal } from "antd";
import type { FormProps } from "antd/lib";
import { useState } from "react";

import { createAmenityAPI } from "@/services/api";
import type { AmenityIconKey } from "@/utils/constants/amenity.icon";
import AmenityIconPicker from "@/utils/amenity.icon.picker";

type CreateAmenityForm = {
    name: string;
    icon: AmenityIconKey;
};

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
    usedIcons: AmenityIconKey[]; 
}

const CreateAmenity = (props: IProps) => {
    const {
        openModalCreate,
        setOpenModalCreate,
        refreshTable,
        usedIcons,
    } = props;

    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm<CreateAmenityForm>();

    const onFinish: FormProps<CreateAmenityForm>["onFinish"] = async (values) => {
        setIsSubmit(true);

        const res = await createAmenityAPI({
            name: values.name,
            icon: values.icon,
        });

        if (res.statusCode === 201) {
            message.success("Amenity created successfully");
            form.resetFields();
            setOpenModalCreate(false);
            refreshTable();
        } else {
            notification.error({
                message: "An error has occurred",
                description: res.message,
            });
        }

        setIsSubmit(false);
    };

    return (
        <Modal
            title="Add Amenity"
            open={openModalCreate}
            onOk={() => form.submit()}
            onCancel={() => {
                setOpenModalCreate(false);
                form.resetFields();
            }}
            okText="Add new"
            cancelText="Cancel"
            confirmLoading={isSubmit}
            width={700}
        >
            <Divider />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Name of amenity"
                    name="name"
                    rules={[{ required: true, message: "Please enter amenity name" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Select icon"
                    name="icon"
                    rules={[{ required: true, message: "Please select an icon" }]}
                >
                    <AmenityIconPicker
                        disabledIcons={usedIcons}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateAmenity;