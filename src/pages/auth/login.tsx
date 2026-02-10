import { useCurrentApp } from "@/components/context/app.context";
import { loginAPI, loginWithGoogleAPI } from "@/services/api";
import { GooglePlusOutlined } from "@ant-design/icons";
import { useGoogleLogin } from "@react-oauth/google";
import { App, Button, Divider, Form, Input, type FormProps } from "antd";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'styles/pages/login.scss';


type FieldType = {
    username: string;
    password: string;
}

const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser, user } = useCurrentApp();
    const { message, notification, modal } = App.useApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

        const { username, password } = values;
        setIsSubmit(true);

        const res = await loginAPI(username, password);
        console.log('>>>>> res user: ')
        console.log(res);
        setIsSubmit(false);
        if (res?.data) {
            setIsAuthenticated(true);
            setUser(res.data.user);
            localStorage.setItem('access_token', res.data.access_token);
            localStorage.setItem(
                'permissions',
                JSON.stringify(res.data.permissions)
            );
            message.success("Đăng nhập tài khoản thành công.");
            navigate('/');
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };


    const loginGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            // 1. Lấy info Google
            const { data } = await axios.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                }
            );

            // 2. Gửi backend
            const res = await loginWithGoogleAPI({
                provider: "GOOGLE",
                email: data.email,
                name: data.name,
                avatar: data.picture
            });

            if (res?.data) {
                setIsAuthenticated(true);
                setUser(res.data.user);

                localStorage.setItem(
                    "access_token",
                    res.data.access_token
                );

                localStorage.setItem(
                    "permissions",
                    JSON.stringify(res.data.permissions)
                );

                message.success("Đăng nhập Google thành công 🎉");
                navigate("/");
            }
        }
    });

    return (
        <div className="login-full">
            <div className="login-overlay" />

            <div className="login-card">
                <div className="back-home">
                    <Link to="/">← Về trang chủ</Link>
                </div>
                <div className="heading">
                    <h2>Đăng nhập</h2>
                    <p>Chào mừng bạn quay lại 👋</p>
                </div>

                <Form
                    name="form-login"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Email"
                        name="username"
                        rules={[
                            { required: true, message: 'Email không được để trống!' },
                            { type: "email", message: 'Email không đúng định dạng!' }
                        ]}
                    >
                        <Input placeholder="email@example.com" />
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

                    {/* Register | Forgot password */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 16,
                            fontSize: 14
                        }}
                    >
                        <span>
                            Chưa có tài khoản?
                            <Link to="/register" style={{ marginLeft: 4 }}>
                                Đăng ký
                            </Link>
                        </span>

                        <Link to="/forgot-password">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmit}
                        block
                    >
                        Đăng nhập
                    </Button>

                    <Divider>Hoặc</Divider>

                    <div
                        onClick={() => loginGoogle()}
                        title="Đăng nhập với Google"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            cursor: "pointer",
                            padding: "8px 0",
                            borderRadius: 6,
                            border: "1px solid #eee"
                        }}
                    >
                        <span>Đăng nhập với</span>
                        <GooglePlusOutlined style={{ fontSize: 26, color: "orange" }} />
                    </div>
                </Form>
            </div>
        </div>
    );

}

export default LoginPage;
