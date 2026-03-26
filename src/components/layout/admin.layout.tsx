import React, { useEffect, useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, Avatar } from 'antd';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useCurrentApp } from '../context/app.context';
import type { MenuProps } from 'antd';
import { logoutAPI } from '@/services/api';
import { ROLE } from '@/utils/constants/global.var';
import { hasPermission } from '@/utils/permission';
import NotificationBell from 'components/layout/notification';
type MenuItem = Required<MenuProps>['items'][number];

const { Content, Footer, Sider } = Layout;

type MenuConfig = {
    label: React.ReactNode;
    key: string;
    icon: React.ReactNode;
    permission?: string;
};

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const { user, setUser, setIsAuthenticated, isAuthenticated } = useCurrentApp();

    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res?.statusCode === 200) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
            localStorage.removeItem('permissions');
            navigate('/');
        }
    };

    const menuConfig: MenuConfig[] = [
        {
            label: <Link to="/admin">Dashboard</Link>,
            key: "/admin",
            icon: <AppstoreOutlined />,
            permission: "USER_LIST_ALL",
        },
        {
            label: <Link to="/admin/user">Manage Users</Link>,
            key: "/admin/user",
            icon: <UserOutlined />,
            permission: "USER_LIST_ALL",
        },
        {
            label: <Link to="/admin/role">Manage Roles</Link>,
            key: "/admin/role",
            icon: <ExceptionOutlined />,
            permission: "ROLE_LIST_ALL",
        },
        {
            label: <Link to="/admin/permission">Manage Permissions</Link>,
            key: "/admin/permission",
            icon: <ExceptionOutlined />,
            permission: "PERMISSION_LIST_ALL",
        },
        {
            label: <Link to="/admin/amenity">Manage Amenities</Link>,
            key: "/admin/amenity",
            icon: <ExceptionOutlined />,
            permission: "AMENITY_LIST_ALL",
        },
        {
            label: <Link to="/admin/property-type">Manage Property Types</Link>,
            key: "/admin/property-type",
            icon: <ExceptionOutlined />,
            permission: "PROPERTY_TYPE_LIST_ALL",
        },
        {
            label: <Link to="/admin/booking">Manage Bookings</Link>,
            key: "/admin/booking",
            icon: <ExceptionOutlined />,
            permission: "BOOKING_LIST_ALL",
        },
        {
            label: <Link to="/admin/contract">Manage Contracts</Link>,
            key: "/admin/contract",
            icon: <ExceptionOutlined />,
            permission: "CONTRACT_LIST_ALL",
        },
        {
            label: <Link to="/admin/property">Manage Properties</Link>,
            key: "/admin/property",
            icon: <ExceptionOutlined />,
            permission: "PROPERTY_LIST_ALL",
        },
        {
            label: <Link to="/admin/payout">Manage Payouts</Link>,
            key: "/admin/payout",
            icon: <ExceptionOutlined />,
            permission: "PAYOUT_LIST_ALL",
        },
        {
            label: <Link to="/admin/fee">Manage Fees</Link>,
            key: "/admin/fee",
            icon: <ExceptionOutlined />,
            permission: "FEE_LIST",
        },
    ];

    const items: MenuItem[] = menuConfig.filter(item =>
        !item.permission || hasPermission(item.permission)
    );

    useEffect(() => {
        const active: any = items.find(item => location.pathname === (item!.key as any)) ?? "/admin";
        setActiveMenu(active.key);
    }, [location])

    const itemsDropdown = [
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <Link to={`/profile/${user?.id}`}>Quản lý tài khoản</Link>,
            key: 'account',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];

    if (isAuthenticated == false) {
        return (
            <Outlet />
        )
    }

    const isAdminRoute = location.pathname.includes("admin");
    if (isAuthenticated === true && isAdminRoute === true) {
        const role = user?.role;
        if (role === ROLE.USER) {
            return (
                <Outlet />
            )
        }
    }

    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
                className="layout-admin"
            >
                <Sider
                    theme='light'
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                        Admin
                    </div>
                    <Menu
                        selectedKeys={[activeMenu]}
                        mode="inline"
                        items={items}
                        onClick={(e) => setActiveMenu(e.key)}
                    />
                </Sider>
                <Layout>
                    <div className='admin-header' style={{
                        height: "50px",
                        borderBottom: "1px solid #ebebeb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 15px",

                    }}>
                        <span>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </span>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                            }}
                        >
                            {isAuthenticated && <NotificationBell />}

                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                <Space style={{ cursor: "pointer" }}>
                                    <Avatar src={user?.avatarUrl} />
                                    <span>{user?.fullName}</span>
                                </Space>
                            </Dropdown>
                        </div>
                    </div>
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ padding: 0, textAlign: "center" }}>
                        Booking Travel <HeartTwoTone />
                    </Footer>
                </Layout>
            </Layout>

        </>
    );
};

export default LayoutAdmin;