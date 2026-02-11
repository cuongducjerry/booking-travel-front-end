import { App, Divider, Form, InputNumber, Modal, Select, DatePicker } from "antd";
import type { FormProps } from "antd/lib";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { createHostContractAPI } from "@/services/api";

type FieldType = {
    expectedCommissionRate: number;
    startDate: string;
    endDate: string;
    propertyIds: number[];
};

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
    properties: IPropertyDetail[]; // truyền từ parent (property của host)
}

const CreateHostContract = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable, properties } = props;

    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setIsSubmit(true);

        const payload = {
            expectedCommissionRate: values.expectedCommissionRate,
            startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
            endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
            propertyIds: values.propertyIds,
        };

        const res = await createHostContractAPI(payload);

        if (res.data && res.statusCode === 201) {
            message.success("Gửi yêu cầu hợp đồng thành công");
            form.resetFields();
            setOpenModalCreate(false);
            refreshTable();
        } else {
            notification.error({
                message: "Không thể tạo hợp đồng",
                description: res.message || "Lỗi hệ thống",
            });
        }
        setIsSubmit(false);
    };

    return (
        <Modal
            title="Tạo hợp đồng mới"
            open={openModalCreate}
            onOk={() => form.submit()}
            onCancel={() => {
                setOpenModalCreate(false);
                form.resetFields();
            }}
            okText="Gửi yêu cầu"
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
                    label="Tỷ lệ hoa hồng (%)"
                    name="expectedCommissionRate"
                    rules={[
                        { required: true, message: "Vui lòng nhập hoa hồng" },
                        { type: "number", min: 0.01, max: 1 },
                    ]}
                >
                    <InputNumber<number>
                        min={0.01}
                        max={1}
                        step={0.01}
                        style={{ width: "100%" }}
                        formatter={(v) => `${Number(v) * 100}%`}
                        parser={(v) =>
                            v ? Number(v.replace("%", "")) / 100 : 0
                        }
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Ngày bắt đầu"
                    name="startDate"
                    rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
                >
                    <DatePicker
                        style={{ width: "100%" }}
                        disabledDate={(d) => d && d < dayjs().startOf("day")}
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Ngày kết thúc"
                    name="endDate"
                    rules={[{ required: true, message: "Chọn ngày kết thúc" }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Property áp dụng"
                    name="propertyIds"
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn property"
                        optionFilterProp="label"
                    >
                        {properties.map(p => (
                            <Select.Option key={p.id} value={p.id} label={p.title}>
                                {p.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateHostContract;
