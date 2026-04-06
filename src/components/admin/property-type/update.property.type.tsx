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
                message.success("Property Type update successful");
                setOpenModalUpdate(false);
                setDataUpdate(null);
                form.resetFields();
                refreshTable();
            } else {
                notification.error({
                    message: "Update failed",
                    description: res.message,
                });
            }
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
            title="Update Property Type"
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
                <Form.Item<FieldType>
                    label="Property Name Type"
                    name="name"
                    rules={[
                        { required: true, message: "Please enter the Property Type name" },
                        { max: 100, message: "Name length: maximum 100 characters" },
                    ]}
                >
                    <Input placeholder="Enter Property Type name" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdatePropertyType;