import {
    App,
    Divider,
    Form,
    Modal,
    DatePicker,
    Select,
    Spin,
} from "antd";
import type { FormProps } from "antd/lib";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { createHostPayoutAPI, getAllContractsAPI } from "@/services/api";

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

const CreatePayout = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;

    const { message, notification } = App.useApp();
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const [loadingContracts, setLoadingContracts] = useState(false);
    const [contracts, setContracts] = useState<IHostContractTable[]>([]);

    /* ================= LOAD CONTRACT ================= */
    const fetchContracts = async () => {
        setLoadingContracts(true);

        const res = await getAllContractsAPI({
            page: 0,
            size: 100,
            status: "ACTIVE",
        });

        console.log('>>>> Res fetch contracts: ')
        console.log(res);

        if (res.data?.result) {
            setContracts(res.data.result);
        }

        setLoadingContracts(false);
    };

    useEffect(() => {
        if (openModalCreate) {
            fetchContracts();
        }
    }, [openModalCreate]);

    /* ================= SUBMIT ================= */
    const onFinish: FormProps<any>["onFinish"] = async (values) => {
        setIsSubmit(true);

        const contract = contracts.find(
            (c) => c.id === values.contractId
        );

        if (!contract) {
            message.error("Invalid contract!");
            setIsSubmit(false);
            return;
        }

        const res = await createHostPayoutAPI({
            contractId: values.contractId,
            periodFrom: values.period[0].format("YYYY-MM-DD"),
            periodTo: values.period[1].format("YYYY-MM-DD"),
        });

        if (res.statusCode === 201) {
            message.success("Payout created successfully");
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
            title="Add Host Payout"
            open={openModalCreate}
            onOk={() => form.submit()}
            onCancel={() => {
                setOpenModalCreate(false);
                form.resetFields();
            }}
            okText="Add payout"
            cancelText="Cancel"
            confirmLoading={isSubmit}
            width={650}
        >
            <Divider />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                {/* CONTRACT */}
                <Form.Item
                    label="Contract"
                    name="contractId"
                    rules={[
                        { required: true, message: "Please select a contract" },
                    ]}
                >
                    <Select
                        loading={loadingContracts}
                        placeholder="Select contract"
                        showSearch
                        optionFilterProp="label"
                        options={contracts.map((c) => ({
                            value: c.id,
                            label: `#${c.contractCode} - Contract Id: ${c.id}`,
                        }))}
                        notFoundContent={
                            loadingContracts ? <Spin size="small" /> : null
                        }
                    />
                </Form.Item>

                {/* PERIOD */}
                <Form.Item
                    label="Payout period"
                    name="period"
                    rules={[
                        { required: true, message: "Please select your payout period" },
                    ]}
                >
                    <DatePicker.RangePicker
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreatePayout;
