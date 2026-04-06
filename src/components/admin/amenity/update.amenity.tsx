import { App, Divider, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { updateAmenityAPI } from "@/services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    AMENITY_ICON_OPTIONS,
    type AmenityIconKey
} from "@/utils/constants/amenity.icon";
import "styles/components/amenity.icon.scss";

type FieldType = {
    name: string;
    icon: AmenityIconKey;
};

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    dataUpdate: IAmenity | null;
    setDataUpdate: (v: IAmenity | null) => void;
    usedIcons: AmenityIconKey[];
}

const UpdateAmenity = (props: IProps) => {
    const {
        openModalUpdate,
        setOpenModalUpdate,
        refreshTable,
        dataUpdate,
        setDataUpdate,
        usedIcons,
    } = props;

    const [form] = Form.useForm();
    const { message, notification } = App.useApp();
    const [isSubmit, setIsSubmit] = useState(false);
    const selectedIcon = Form.useWatch("icon", form);

    // set default data
    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
                icon: dataUpdate.icon,
            });
        }
    }, [dataUpdate, form]);

    const onFinish = async (values: FieldType) => {
        if (!dataUpdate?.id) return;

        try {
            setIsSubmit(true);

            await updateAmenityAPI({
                id: dataUpdate.id,
                name: values.name,
                icon: values.icon,
            });

            message.success("Amenity update successful");
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
            title="Update amenity"
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

            <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* NAME */}
                <Form.Item<FieldType>
                    label="Amenities Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter the name of the amenity" }]}
                >
                    <Input />
                </Form.Item>

                {/* ICON */}
                <Form.Item<FieldType>
                    label="Icon"
                    name="icon"
                    rules={[{ required: true, message: "Please select an icon" }]}
                >
                    <div className="amenity-icon-grid">
                        {AMENITY_ICON_OPTIONS.map(opt => {
                            const isUsed = usedIcons.includes(opt.key) && opt.key !== dataUpdate?.icon;
                            const isSelected = selectedIcon === opt.key;

                            return (
                                <div
                                    key={opt.key}
                                    className={`
                                                amenity-icon-item
                                                ${isUsed ? "disabled" : ""}
                                                ${isSelected ? "selected" : ""}
                                               `}
                                    onClick={() => {
                                        if (!isUsed) {
                                            form.setFieldValue("icon", opt.key);
                                        }
                                    }}
                                >
                                    <FontAwesomeIcon icon={opt.icon} />
                                    <div className="label">{opt.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateAmenity;