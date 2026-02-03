import {
    Tabs,
    Form,
    Input,
    Button,
    Upload,
    Avatar,
    Card,
    Row,
    Col,
    Typography,
    Space,
    Divider,
    App,
} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { updateUserAvatarAPI, updateUserPasswordAPI, updateUserProfileAPI } from "@/services/api";

const { Title, Text } = Typography;

interface Props {
    user: IUserDetail | null;
}

const ProfileDetail = ({ user }: Props) => {
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [form] = Form.useForm();
    const { message, notification, modal } = App.useApp();

    /* ===== FILL DATA KHI LOAD USER ===== */
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                address: user.address,
                age: user.age,
                bio: user.bio,
            });
            setAvatar(user.avatarUrl);
        }
    }, [user, form]);

    /* ===== UPDATE PROFILE ===== */
    const onUpdateProfile = async (values: any) => {
        try {
            setLoading(true);

            await updateUserProfileAPI({
                id: user!.id,
                fullName: values.fullName,
                phone: values.phone,
                bio: values.bio,
                address: values.address,
                age: values.age,
            });

            message.success("Cập nhật thông tin thành công");
        } finally {
            setLoading(false);
        }
    };

    /* ===== CHANGE PASSWORD ===== */
    const onChangePassword = async (values: any) => {
        if (values.newPassword !== values.confirmPassword) {
            return message.error("Mật khẩu xác nhận không khớp");
        }

        const res = await updateUserPasswordAPI({
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
        });

        if (res.data) {
            message.success("Đổi mật khẩu thành công");
        } else {
            message.error("Mật khẩu cũ không khớp!");
        }
    };

    /* ===== UPLOAD AVATAR ===== */
    const onUploadAvatar = async (file: File) => {
        await updateUserAvatarAPI(file);

        setAvatar(URL.createObjectURL(file));
        message.success("Cập nhật avatar thành công");
        return false;
    };
    if (!user) return null;

    return (
        <Row justify="center" style={{ marginTop: 40 }}>
            <Col xs={24} sm={22} md={16} lg={10}>
                <Card
                    style={{
                        borderRadius: 12,
                        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                    }}
                    bodyStyle={{ padding: 32 }}
                >
                    {/* ===== HEADER ===== */}
                    <Space size={20} align="center">
                        <Avatar size={80} src={avatar} icon={<UserOutlined />} />
                        <div>
                            <Title level={4} style={{ margin: 0 }}>
                                {user.fullName}
                            </Title>
                            <Text type="secondary">{user.email}</Text>
                        </div>
                    </Space>

                    <Divider />

                    {/* ===== TABS ===== */}
                    <Tabs defaultActiveKey="1" type="card" size="large" centered>
                        {/* ===== TAB 1: PROFILE ===== */}
                        <Tabs.TabPane tab="Thông tin cá nhân" key="1" style={{ marginTop: 30 }}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onUpdateProfile}
                                    style={{ width: "100%", maxWidth: 420 }}
                                >
                                    <Form.Item label="Email" name="email">
                                        <Input disabled />
                                    </Form.Item>

                                    <Form.Item label="Giới thiệu" name="bio">
                                        <Input.TextArea rows={3} maxLength={500} />
                                    </Form.Item>

                                    <Form.Item
                                        label="Họ tên"
                                        name="fullName"
                                        rules={[{ required: true }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item label="Số điện thoại" name="phone">
                                        <Input />
                                    </Form.Item>

                                    <Form.Item label="Địa chỉ" name="address">
                                        <Input />
                                    </Form.Item>

                                    <Form.Item label="Tuổi" name="age">
                                        <Input type="number" />
                                    </Form.Item>

                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        size="large"
                                        loading={loading}
                                    >
                                        Lưu thay đổi
                                    </Button>
                                </Form>
                            </div>
                        </Tabs.TabPane>

                        {/* ===== TAB 2: AVATAR ===== */}
                        <Tabs.TabPane tab="Ảnh đại diện" key="2" style={{ marginTop: 30 }}>
                            <Space
                                direction="vertical"
                                align="center"
                                size={24}
                                style={{ width: "100%" }}
                            >
                                <Avatar size={140} src={avatar} icon={<UserOutlined />} />

                                <Upload
                                    showUploadList={false}
                                    beforeUpload={onUploadAvatar}
                                    accept="image/*"
                                >
                                    <Button icon={<UploadOutlined />}>Upload ảnh mới</Button>
                                </Upload>

                                <Text type="secondary">PNG, JPG – tối đa 2MB</Text>
                            </Space>
                        </Tabs.TabPane>

                        {/* ===== TAB 3: PASSWORD ===== */}
                        <Tabs.TabPane tab="Đổi mật khẩu" key="3" style={{ marginTop: 30 }}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <Form
                                    layout="vertical"
                                    onFinish={onChangePassword}
                                    style={{ width: "100%", maxWidth: 380 }}
                                >
                                    <Form.Item
                                        label="Mật khẩu cũ"
                                        name="oldPassword"
                                        rules={[{ required: true }]}
                                    >
                                        <Input.Password />
                                    </Form.Item>

                                    <Form.Item
                                        label="Mật khẩu mới"
                                        name="newPassword"
                                        rules={[{ required: true, min: 6 }]}
                                    >
                                        <Input.Password />
                                    </Form.Item>

                                    <Form.Item
                                        label="Xác nhận mật khẩu"
                                        name="confirmPassword"
                                        rules={[{ required: true }]}
                                    >
                                        <Input.Password />
                                    </Form.Item>

                                    <Button type="primary" htmlType="submit" block size="large">
                                        Đổi mật khẩu
                                    </Button>
                                </Form>
                            </div>
                        </Tabs.TabPane>
                    </Tabs>
                </Card>
            </Col>
        </Row>
    );
};

export default ProfileDetail;
