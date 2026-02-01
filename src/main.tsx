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
import RegisterPage from './pages/auth/register';
import PropertyPage from './pages/user/property';
import Layout from '@/layout';
import ProfilePage from 'pages/user/profile';
import ProtectedRoute from 'components/auth';
import SearchPage from 'pages/user/search.page';

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
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>
)
