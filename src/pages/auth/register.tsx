import { registerAPI } from "@/services/api";
import {
  App,
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  type FormProps,
} from "antd";
import type dayjs from "dayjs";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "styles/pages/register.scss";

type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    dateOfBirth: dayjs.Dayjs; 
    roleId: 3 | 4;
};

const RegisterPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { message, notification, modal } = App.useApp();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);

    const payload = {
      email: values.email,
      password: values.password,
      fullName: values.fullName,
      phone: values.phone,
      address: values.address,
      dateOfBirth: values.dateOfBirth
        ? values.dateOfBirth.format("YYYY-MM-DD")
        : undefined,
      role: {
        id: Number(values.roleId) as 3 | 4,
      },
    };

    const res = await registerAPI(payload);

    if (res.statusCode === 201 && res.data) {
      message.success("Registration successful.");
      navigate("/login");
    } else {
      message.error(res.message);
    }

    setIsSubmit(false);
  };

  console.log(">>> check env: ", import.meta.env.VITE_BACKEND_URL);

  return (
    <div className="register-full">
      <div className="register-overlay" />

      <div className="register-card">
        <div className="back-home">
          <Link to="/">← Back to homepage</Link>
        </div>
        <div className="heading">
          <h2>Register an account</h2>
          <p>Start your booking journey ✨</p>
        </div>

        <Form
          name="form-register"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "The full name cannot be left blank!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email address cannot be left blank!" },
              { type: "email", message: "Email is not in the correct format!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[
              { required: true, message: "The password cannot be left blank!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div className="grid">
            <Form.Item<FieldType>
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "The phone number must not be left blank!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Birth of Date"
              name="dateOfBirth"
              rules={[
                { required: true, message: "Date of birth cannot be left blank!" },
              ]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%", height: 43 }} />
            </Form.Item>
          </div>

          <Form.Item<FieldType>
            label="Address"
            name="address"
            rules={[
              { required: true, message: "The address must not be left blank!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Role"
            name="roleId"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <select className="role-select">
              <option value="">-- Choose a role --</option>
              <option value={4}>USER (Make a reservation)</option>
              <option value={3}>HOST (Lease)</option>
            </select>
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={isSubmit} block>
            Register
          </Button>
          <Divider />

          <p className="switch-auth">
            Do you already have an account?
            <Link to="/login"> Login</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
