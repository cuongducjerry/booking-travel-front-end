import React, { useEffect, useState } from "react";
import {
    AppstoreOutlined,
    BookOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Space, Avatar } from "antd";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import type { MenuProps } from "antd";
import { useCurrentApp } from "@/components/context/app.context";
import { logoutAPI } from "@/services/api";
import { ROLE } from "@/utils/constants/global.var";
import { hasPermission } from "@/utils/permission";

const { Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

type MenuConfig = {
    label: React.ReactNode;
    key: string;
    icon: React.ReactNode;
    permission?: string; // giữ form giống admin
};

const LayoutHost = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState("");
    const { user, setUser, setIsAuthenticated, isAuthenticated } = useCurrentApp();

    const location = useLocation();
    const navigate = useNavigate();


    if (!isAuthenticated || user?.role !== ROLE.HOST) {
        return <Outlet />;
    }

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res?.statusCode === 200) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
            localStorage.removeItem("permissions");
            navigate("/");
        }
    };

    // ===== MENU CONFIG =====
    const menuConfig: MenuConfig[] = [
        {
            label: <Link to="/host">Dashboard</Link>,
            key: "/host",
            icon: <AppstoreOutlined />,
        },
        {
            label: <Link to="/host/booking">Manage Booking</Link>,
            key: "/host/booking",
            icon: <BookOutlined />,
            permission: "BOOKING_LIST_OWN"
        },
          {
            label: <Link to="/host/contract">Manage Contract</Link>,
            key: "/host/contract",
            icon: <BookOutlined />,
            permission: "CONTRACT_LIST_PERSONAL"
        },
    ];


    const items = menuConfig.filter(
        item => !item.permission || hasPermission(item.permission)
    );

    useEffect(() => {
        const active =
            items.find(item => item?.key === location.pathname) ?? items[0];
        setActiveMenu(active!.key as string);
    }, [location]);

    const dropdownItems: MenuProps["items"] = [
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            key: "profile",
            label: <Link to={`/profile/${user?.id}`}>Quản lý tài khoản</Link>,
        },
        {
            key: "logout",
            label: (
                <span onClick={handleLogout} style={{ cursor: "pointer" }}>
                    Đăng xuất
                </span>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                theme="light"
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
            >
                <div style={{ height: 32, margin: 16, textAlign: "center" }}>
                    Host Panel
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[activeMenu]}
                    items={items}
                    onClick={e => setActiveMenu(e.key)}
                />
            </Sider>

            <Layout>
                <div
                    style={{
                        height: 50,
                        borderBottom: "1px solid #ebebeb",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0 15px",
                    }}
                >
                    {React.createElement(
                        collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                        { onClick: () => setCollapsed(!collapsed) }
                    )}

                    <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
                        <Space style={{ cursor: "pointer" }}>
                            <Avatar src={user?.avatarUrl} />
                            {user?.fullName}
                        </Space>
                    </Dropdown>
                </div>

                <Content style={{ padding: 16 }}>
                    <Outlet />
                </Content>

                <Footer style={{ textAlign: "center", padding: 0 }}>
                    Host Booking Management
                </Footer>
            </Layout>
        </Layout>
    );
};

export default LayoutHost;
