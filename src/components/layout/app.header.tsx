import { useState } from 'react';
import { Divider, Drawer, Avatar, Dropdown, Space } from 'antd';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import 'styles/layouts/header.scss';
import { useCurrentApp } from 'components/context/app.context';
import { logoutAPI } from '@/services/api';

const AppHeader = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openManageAccount, setOpenManageAccount] = useState(false);

  const { isAuthenticated, user, setUser, setIsAuthenticated } = useCurrentApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = async () => {
    const res = await logoutAPI();
    if (res?.statusCode === 200) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('access_token');
      navigate('/');
    }
  };

  const items: any[] = [];

  const isUser = user?.role === "USER";
  const isHost = user?.role === "HOST";
  const isAdmin =
    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  /* ===== (USER + HOST + ADMIN) ===== */
  if (isUser || isHost || isAdmin) {
    items.push({
      key: "account",
      label: <span>Quản lý tài khoản</span>,
    });
  }

  /* ===== USER ===== */
  if (isUser) {
    items.push({
      key: "history",
      label: <Link to="/booking-history">Lịch sử booking</Link>,
    });
  }

  /* ===== HOST ===== */
  if (isHost) {
    items.push({
      key: "host",
      label: <Link to="/host">Trang quản trị host</Link>,
    });
  }

  /* ===== ADMIN / SUPER ADMIN ===== */
  if (isAdmin) {
    items.push({
      key: "admin",
      label: <Link to="/admin">Trang quản trị admin</Link>,
    });
  }

  /* ===== LOGOUT (TẤT CẢ ROLE) ===== */
  items.push({
    key: "logout",
    label: <span onClick={handleLogout}>Đăng xuất</span>,
  });

  return (
    <>
      <header className="airbnb-header">
        <div className="header-inner">
          <div className="left">
            <span className="menu-icon" onClick={() => setOpenDrawer(true)}>
              ☰
            </span>

            <div className="logo" onClick={() => navigate('/')}>
              <span>Booking Travel</span>
            </div>
          </div>

          <div className="right">
            {!isAuthenticated ? (
              !isAuthPage && (
                <div className="auth-actions">
                  <Link to="/login">Đăng nhập</Link>
                  <Link to="/register" className="btn-register">
                    Đăng ký
                  </Link>
                </div>
              )
            ) : (
              <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                <div className="user-dropdown">
                  <Avatar size={30}>
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </Avatar>
                  <span className="user-name">{user?.fullName}</span>
                </div>
              </Dropdown>
            )}
          </div>
        </div>
      </header>

      <Drawer
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p onClick={() => navigate('/')}>Trang chủ</p>
        <Divider />
        {isAuthenticated && (
          <>
            <p onClick={() => setOpenManageAccount(true)}>Tài khoản</p>
            <Divider />
            <p onClick={handleLogout}>Đăng xuất</p>
          </>
        )}
      </Drawer>
    </>
  );
};

export default AppHeader;
