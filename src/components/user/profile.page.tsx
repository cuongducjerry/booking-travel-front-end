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
  DatePicker,
} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  updateUserAvatarAPI,
  updateUserPasswordAPI,
  updateUserProfileAPI,
} from "@/services/api";

const { Title, Text } = Typography;

interface Props {
  user: IUserDetail | null;
}

const ProfileDetail = ({ user }: Props) => {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  /* ===== FILL DATA ===== */
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
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
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.format("YYYY-MM-DD")
          : undefined,
      });

      message.success("Information updated successfully");
    } finally {
      setLoading(false);
    }
  };

  /* ===== CHANGE PASSWORD ===== */
  const onChangePassword = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      return message.error("The verification password does not match");
    }

    const res = await updateUserPasswordAPI({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });

    if (res.data) {
      message.success("Password changed successfully");
    } else {
      message.error("The old password doesn't match!");
    }
  };

  /* ===== UPLOAD AVATAR ===== */
  const onUploadAvatar = async (file: File) => {
    await updateUserAvatarAPI(file);
    setAvatar(URL.createObjectURL(file));
    message.success("Avatar update successful");
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
          {/* HEADER */}
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

          <Tabs defaultActiveKey="1" type="card" size="large" centered>
            {/* ===== PROFILE ===== */}
            <Tabs.TabPane tab="Personal information" key="1">
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

                  <Form.Item label="Bio" name="bio">
                    <Input.TextArea rows={3} maxLength={500} />
                  </Form.Item>

                  <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item label="Phone" name="phone">
                    <Input />
                  </Form.Item>

                  <Form.Item label="Address" name="address">
                    <Input />
                  </Form.Item>

                  <Form.Item label="Birth of Date" name="dateOfBirth">
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                  >
                    Save changes
                  </Button>
                </Form>
              </div>
            </Tabs.TabPane>

            {/* ===== AVATAR ===== */}
            <Tabs.TabPane tab="Avatar" key="2">
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
                  <Button icon={<UploadOutlined />}>Upload new photos</Button>
                </Upload>

                <Text type="secondary">PNG, JPG – maximum 2MB</Text>
              </Space>
            </Tabs.TabPane>

            {/* ===== PASSWORD ===== */}
            <Tabs.TabPane tab="Change password" key="3">
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Form
                  layout="vertical"
                  onFinish={onChangePassword}
                  style={{ width: "100%", maxWidth: 380 }}
                >
                  <Form.Item
                    label="Old password"
                    name="oldPassword"
                    rules={[{ required: true }]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    label="New password"
                    name="newPassword"
                    rules={[{ required: true, min: 6 }]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    label="Confirm password"
                    name="confirmPassword"
                    rules={[{ required: true }]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Button type="primary" htmlType="submit" block size="large">
                    Save
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
