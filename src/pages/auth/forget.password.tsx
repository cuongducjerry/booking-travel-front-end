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
            message.success("The new password has been sent to your email 📩");
            navigate("/login");
        } else {
            notification.error({
                message: "An error occurred",
                description: res.message
            });
        }
    };

    return (
        <div className="login-full">
            <div className="login-overlay" />

            <div className="login-card">
                <div className="back-home">
                    <Link to="/login">← Go back to login</Link>
                </div>

                <div className="heading">
                    <h2>Forgot password</h2>
                    <p>Enter your email to receive a new password 📧</p>
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
                            { required: true, message: "Email address cannot be left blank" },
                            { type: "email", message: "Invalid email" }
                        ]}
                    >
                        <Input placeholder="email@example.com" />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                    >
                        Send new password
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

