import { useCurrentApp } from "@/components/context/app.context";
import { loginAPI } from "@/services/api";
import { Button, Divider, Form, Input, message, notification, type FormProps } from "antd";
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

    // const loginGoogle = useGoogleLogin({
    //     onSuccess: async (tokenResponse) => {
    //         console.log(tokenResponse);

    //         const { data } = await axios(
    //             "https://www.googleapis.com/oauth2/v3/userinfo",
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${tokenResponse?.access_token}`,
    //                 },
    //             }
    //         );
    //         if (data && data.email) {
    //             //call backend create user
    //             const res = await loginWithGoogleAPI("GOOGLE", data.email);

    //             if (res?.data) {
    //                 setIsAuthenticated(true);
    //                 setUser(res.data.user)
    //                 localStorage.setItem('access_token', res.data.access_token);
    //                 message.success('Đăng nhập tài khoản thành công!');
    //                 navigate('/')
    //             } else {
    //                 notification.error({
    //                     message: "Có lỗi xảy ra",
    //                     description:
    //                         res.message && Array.isArray(res.message) ? res.message[0] : res.message,
    //                     duration: 5
    //                 })
    //             }
    //         }

    //     }
    // });

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
                        rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmit}
                        block
                    >
                        Đăng nhập
                    </Button>

                    <Divider />

                    <p className="switch-auth">
                        Chưa có tài khoản?
                        <Link to="/register"> Đăng ký</Link>
                    </p>
                </Form>
            </div>
        </div>
    );

}

export default LoginPage;
