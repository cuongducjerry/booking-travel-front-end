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
            message.success("Tạo amenity thành công");
            form.resetFields();
            setOpenModalCreate(false);
            refreshTable();
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message,
            });
        }

        setIsSubmit(false);
    };

    return (
        <Modal
            title="Thêm Amenity"
            open={openModalCreate}
            onOk={() => form.submit()}
            onCancel={() => {
                setOpenModalCreate(false);
                form.resetFields();
            }}
            okText="Tạo mới"
            cancelText="Hủy"
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
                    label="Tên amenity"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Chọn icon"
                    name="icon"
                    rules={[{ required: true, message: "Vui lòng chọn icon" }]}
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