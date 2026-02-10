import { App, Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordAPI } from "@/services/api";
import 'styles/pages/login.scss';

type FieldType = {
    email: string;
};

const ForgotPasswordPage = () => {
    const { message, notification } = App.useApp();
    const navigate = useNavigate();

    const onFinish = async (values: FieldType) => {
        const res = await forgotPasswordAPI(values.email);

        if (res?.data) {
            message.success("Mật khẩu mới đã được gửi về email 📩");
            navigate("/login");
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            });
        }
    };

    return (
        <div className="login-full">
            <div className="login-overlay" />

            <div className="login-card">
                <div className="back-home">
                    <Link to="/login">← Quay lại đăng nhập</Link>
                </div>

                <div className="heading">
                    <h2>Quên mật khẩu</h2>
                    <p>Nhập email để nhận mật khẩu mới 📧</p>
                </div>

                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Email không được để trống" },
                            { type: "email", message: "Email không hợp lệ" }
                        ]}
                    >
                        <Input placeholder="email@example.com" />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                    >
                        Gửi mật khẩu mới
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

