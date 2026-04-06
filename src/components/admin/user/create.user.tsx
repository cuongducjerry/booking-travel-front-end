import { createUserAPI, getRolesAPI } from "@/services/api";
import { ROLE } from "@/utils/constants/global.var";
import { App, Divider, Form, Input, Modal, Select, DatePicker } from "antd";
import type { FormProps } from "antd/lib";
import dayjs from "dayjs";

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
  dateOfBirth?: dayjs.Dayjs; 
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

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);

    const payload: ICreateUserReq = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      phone: values.phone,
      address: values.address,
      dateOfBirth: values.dateOfBirth
        ? values.dateOfBirth.format("YYYY-MM-DD")
        : undefined, 
      role: {
        id: values.roleId,
      },
    };

    const res = await createUserAPI(payload);

    if (res.data && res.statusCode === 201) {
      message.success("New user created successfully");
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
      title="Add a new user"
      open={openModalCreate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModalCreate(false);
        form.resetFields();
      }}
      okText={"Add new"}
      cancelText={"Cancel"}
      confirmLoading={isSubmit}
    >
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please enter the display name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email address" },
            { type: "email", message: "Invalid email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter the password" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Please enter the phone number" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter the address" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Birth of Date"
          name="dateOfBirth"
          rules={[{ required: true, message: "Please select your date of birth" }]}
        >
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          label="Role"
          name="roleId"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select placeholder="Select role">
            {roles
              .filter((role) => role.name !== ROLE.SUPER_ADMIN)
              .map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUser;
