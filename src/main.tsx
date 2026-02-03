import 'styles/globals/global.scss'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from 'pages/auth/login';
import { AppProvider } from 'components/context/app.context';
import HomePage from '@/pages/user/home.page';
import RegisterPage from 'pages/auth/register';
import PropertyPage from 'pages/user/property';
import Layout from '@/components/layout/layout';
import ProfilePage from 'pages/user/profile';
import ProtectedRoute from 'components/auth';
import SearchPage from 'pages/user/search.page';
import BookingPage from 'pages/user/booking';
import BookingHistoryPage from 'components/user/booking.history';
import LayoutAdmin from 'components/layout/admin.layout';
import DashBoardPage from 'pages/admin/dashboard';
import ManageUserPage from 'pages/admin/manage.user';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import { App as AntdApp } from 'antd';
import ManageRolePage from 'pages/admin/manage.role';
import ManagePermissionPage from 'pages/admin/manage.permission';
import { ROLE } from '@/utils/constants/global.var';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/property/:id",
        element: <PropertyPage />,
      },
      {
        path: "/search",
        element: <SearchPage />
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoute
            permission={[
              "USER_UPDATE_PROFILE",
              "USER_UPDATE_AVATAR",
              "USER_UPDATE_PASSWORD",
              "USER_VIEW"
            ]}
          >
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/booking/:propertyId",
        element: (
          <ProtectedRoute permission={["BOOKING_CREATE"]}>
            <BookingPage />
          </ProtectedRoute>
        )
      },
      {
        path: "/booking-history",
        element: (
          <ProtectedRoute permission={["BOOKING_LIST_PERSONAL"]}>
            <BookingHistoryPage />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: "admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute role={[ROLE.ADMIN, ROLE.SUPER_ADMIN]}>
            <DashBoardPage />
          </ProtectedRoute>
        )
      },
      {
        path: "user",
        element: (
          <ProtectedRoute role={[ROLE.ADMIN, ROLE.SUPER_ADMIN]}>
            <ManageUserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "role",
        element: (
          <ProtectedRoute role={[ROLE.SUPER_ADMIN]}>
            <ManageRolePage />
          </ProtectedRoute>
        )
      },
      {
        path: "permission",
        element: (
          <ProtectedRoute role={[ROLE.SUPER_ADMIN]}>
            <ManagePermissionPage />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <ConfigProvider locale={enUS}>
        <AntdApp>
          <RouterProvider router={router} />
        </AntdApp>
      </ConfigProvider>
    </AppProvider>
  </StrictMode>
);
