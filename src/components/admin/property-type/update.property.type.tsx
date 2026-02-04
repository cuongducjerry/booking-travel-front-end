import { App, Divider, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { updatePropertyTypeAPI } from "@/services/api";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: IPropertyType | null) => void;
    dataUpdate: IPropertyType | null;
}

type FieldType = {
    name: string;
};

const UpdatePropertyType = (props: IProps) => {
    const {
        openModalUpdate,
        setOpenModalUpdate,
        refreshTable,
        setDataUpdate,
        dataUpdate,
    } = props;

    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm<FieldType>();

    // set default value 
    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
            });
        }
    }, [dataUpdate, form]);

    const onFinish = async (values: FieldType) => {
        if (!dataUpdate?.id) return;

        try {
            setIsSubmit(true);

            const res = await updatePropertyTypeAPI({
                id: dataUpdate.id,
                name: values.name,
            });

            if (res.statusCode === 200) {
                message.success("Cập nhật Property Type thành công");
                setOpenModalUpdate(false);
                setDataUpdate(null);
                form.resetFields();
                refreshTable();
            } else {
                notification.error({
                    message: "Cập nhật thất bại",
                    description: res.message,
                });
            }
        } catch (error: any) {
            notification.error({
                message: "Cập nhật thất bại",
                description: error?.message || "Lỗi hệ thống",
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <Modal
            title="Cập nhật Property Type"
            open={openModalUpdate}
            onOk={() => form.submit()}
            onCancel={() => {
                setOpenModalUpdate(false);
                setDataUpdate(null);
                form.resetFields();
            }}
            okText="Cập nhật"
            cancelText="Hủy"
            confirmLoading={isSubmit}
        >
            <Divider />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item<FieldType>
                    label="Tên Property Type"
                    name="name"
                    rules={[
                        { required: true, message: "Vui lòng nhập tên Property Type" },
                        { max: 100, message: "Tên tối đa 100 ký tự" },
                    ]}
                >
                    <Input placeholder="Nhập tên Property Type" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdatePropertyType;