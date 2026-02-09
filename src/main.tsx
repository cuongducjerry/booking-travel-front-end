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
import ManageAmenityPage from 'pages/admin/manage.amenity';
import ManagePropertyTypePage from 'pages/admin/manage.property.type';
import LayoutHost from 'components/layout/host.layout';
import HostDashboardPage from 'pages/host/dashboard';
import HostManageBookingPage from 'pages/host/manage.booking';
import ManageBookingPage from 'pages/admin/manage.booking';
import HostManageContractPage from 'pages/host/manage.contract';
import AdminManageContractPage from 'pages/admin/manage.contract';
import HostManagePropertyPage from 'pages/host/manage.property';
import AdminManagePropertyPage from 'pages/admin/manage.property';
import HostCreatePropertyPage from 'pages/host/create.property';
import HostUpdatePropertyPage from 'pages/host/update.property';
import AdminManagePayoutPage from 'pages/admin/manage.payout';
import HostManagePayoutPage from 'pages/host/manage.payout';
import AdminManageFeePage from 'pages/admin/manage.fee';
import HostManageFeePage from 'pages/host/manage.fee';
import MyWishlist from 'pages/user/wishlist';

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
      },
      {
        path: "/my-wishlist",
        element: (
          <ProtectedRoute permission={["WISHLIST_PERSONAL"]}>
            <MyWishlist />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: "admin",
    element: (
      <ProtectedRoute role={[ROLE.ADMIN, ROLE.SUPER_ADMIN]}>
        <LayoutAdmin />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashBoardPage />
          </ProtectedRoute>
        )
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
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
      },
      {
        path: "amenity",
        element: (
          <ProtectedRoute>
            <ManageAmenityPage />
          </ProtectedRoute>
        )
      },
      {
        path: "property-type",
        element: (
          <ProtectedRoute>
            <ManagePropertyTypePage />
          </ProtectedRoute>
        )
      },
      {
        path: "booking",
        element: (
          <ProtectedRoute>
            <ManageBookingPage />
          </ProtectedRoute>
        )
      },
      {
        path: "contract",
        element: (
          <ProtectedRoute>
            <AdminManageContractPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "property",
        element: (
          <ProtectedRoute>
            <AdminManagePropertyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "payout",
        element: (
          <ProtectedRoute>
            <AdminManagePayoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "fee",
        element: (
          <ProtectedRoute>
            <AdminManageFeePage />
          </ProtectedRoute>
        ),
      }
    ]
  },
  {
    path: "host",
    element: (
      <ProtectedRoute role={[ROLE.HOST]}>
        <LayoutHost />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HostDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "booking",
        element: (
          <ProtectedRoute>
            <HostManageBookingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "contract",
        element: (
          <ProtectedRoute>
            <HostManageContractPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "property",
        element: (
          <ProtectedRoute>
            <HostManagePropertyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "property/create",
        element: (
          <ProtectedRoute>
            <HostCreatePropertyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "property/update/:id",
        element: (
          <ProtectedRoute>
            <HostUpdatePropertyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "payout",
        element: (
          <ProtectedRoute>
            <HostManagePayoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "fee",
        element: (
          <ProtectedRoute>
            <HostManageFeePage />
          </ProtectedRoute>
        ),
      }
    ],
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
