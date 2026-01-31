import { registerAPI } from "@/services/api";
import { Button, Divider, Form, Input, message, type FormProps } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "styles/pages/register.scss";

type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    age: number;
    roleId: 3 | 4;
};

const RegisterPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);

        const payload = {
            email: values.email,
            password: values.password,
            fullName: values.fullName,
            phone: values.phone,
            address: values.address,
            age: values.age,
            role: {
                id: values.roleId
            }
        };

        const res = await registerAPI(payload);

        if (res.data) {
            message.success("Đăng ký thành công.");
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
                    <Link to="/">← Về trang chủ</Link>
                </div>
                <div className="heading">
                    <h2>Đăng ký tài khoản</h2>
                    <p>Bắt đầu hành trình đặt chỗ của bạn ✨</p>
                </div>

                <Form
                    name="form-register"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Họ tên"
                        name="fullName"
                        rules={[
                            { required: true, message: 'Họ tên không được để trống!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Email không được để trống!' },
                            { type: 'email', message: 'Email không đúng định dạng!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            { required: true, message: 'Mật khẩu không được để trống!' }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <div className="grid">
                        <Form.Item<FieldType>
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                { required: true, message: 'Số điện thoại không được để trống!' }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Tuổi"
                            name="age"
                            rules={[
                                { required: true, message: 'Tuổi không được để trống!' }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </div>

                    <Form.Item<FieldType>
                        label="Địa chỉ"
                        name="address"
                        rules={[
                            { required: true, message: 'Địa chỉ không được để trống!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Vai trò"
                        name="roleId"
                        rules={[
                            { required: true, message: 'Vui lòng chọn vai trò!' }
                        ]}
                    >
                        <select className="role-select">
                            <option value="">-- Chọn vai trò --</option>
                            <option value={4}>USER (Đặt chỗ)</option>
                            <option value={3}>HOST (Cho thuê)</option>
                        </select>
                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={isSubmit} block>
                        Đăng ký
                    </Button>
                    <Divider />

                    <p className="switch-auth">
                        Đã có tài khoản?
                        <Link to="/login"> Đăng nhập</Link>
                    </p>
                </Form>

            </div>
        </div>
    );


}

export default RegisterPage;