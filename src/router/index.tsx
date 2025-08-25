import { useRoutes, Navigate, RouteObject } from "react-router-dom";
import Menu from "../layouts/SideMenu";
import { selectAuth } from "../stores/auth";
import { useAppSelector } from "../stores/hooks";
import { Suspense, lazy } from "react";
import Loader from "../components/Loader";
import { ToastContainer } from "react-toastify";
import { selectDarkMode } from "../stores/darkModeSlice";

interface AuthType {
  token: string;
}

const RenderRoutes = () => {
  const auth: AuthType = useAppSelector(selectAuth);

  const DashboardOverview1 = lazy(() => import("../pages/DashboardOverview1"));
  const CustomerList = lazy(() => import("../pages/CustomerManagement"));
  const FeedbackList = lazy(() => import("../pages/Feedback"));
  const BackupList = lazy(() => import("../pages/Backup"));
  const ChangePassword = lazy(() => import("../pages/ChangePassword"));
  const CmsList = lazy(() => import("../pages/CmsManagement"));
  const CmsManagement = lazy(() => import("../pages/CmsManagement/AddDetails"));
  const ViewCms = lazy(() => import("../pages/CmsManagement/ViewDescription"));
  const AdminList = lazy(() => import("../pages/AdminManagement/index"));
const AdminManagement = lazy(() => import("../pages/AdminManagement/ManageAdmin"));
  const Profile = lazy(() => import("../pages/Profile"));
  const ApiLogsList = lazy(() => import("../pages/LogsManagement/ApiLogs"));
  const Login = lazy(() => import("../pages/Login"));
  const ForgetPassword = lazy(() => import("../pages/Login/ForgetPassword"));
  const ResetPassword = lazy(() => import("../pages/Login/ResetPassword"));
  const ErrorPage = lazy(() => import("../pages/ErrorPage"));
  const UnAuthorizedPage = lazy(
    () => import("../pages/ErrorPage/UnAuthorized")
  );

  const routes: RouteObject[] = [
    {
      path: "/",
      // if token available then navigate to dashboard
      element: auth.token ? <Menu /> : <Navigate to="/login" />,
      children: [
        {
          path: "/",
          element: <Navigate to={`/dashboard`} replace />,
        },
        {
          path: "/dashboard",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <DashboardOverview1 />
            </Suspense>
          ),
        },
        {
          path: "/profile",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <Profile />
            </Suspense>
          ),
        },
        {
          path: "/customers",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <CustomerList />
            </Suspense>
          ),
        },
        {
          path: "/feedbacks",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <FeedbackList />
            </Suspense>
          ),
        },
        {
          path: "/changepassword",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <ChangePassword />
            </Suspense>
          ),
        },
        {
          path: "/admins",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <AdminList />
            </Suspense>
          ),
        },
        {
          path: "/manage-admin/:id?",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <AdminManagement />
            </Suspense>
          ),
        },
        {
          path: "/cms",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <CmsList />
            </Suspense>
          ),
        },
        {
          path: "/cms/manage",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <CmsManagement />
            </Suspense>
          ),
        },
        {
          path: "/cms/viewdescription",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <ViewCms />
            </Suspense>
          ),
        },
        {
          path: "/api-logs",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <ApiLogsList />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "/login",
      // if token not available then navigate to login
      element: !auth.token ? (
        <Suspense fallback={<Loader icon="puff" />}>
          <Login />
        </Suspense>
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: "/forget-password",
      element: !auth.token ? (
        <Suspense fallback={<Loader icon="puff" />}>
          <ForgetPassword />
        </Suspense>
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: "/reset-password",
      element: !auth.token ? (
        <Suspense fallback={<Loader icon="puff" />}>
          <ResetPassword />
        </Suspense>
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: "/unauthorized",
      element: !auth.token ? (
        <Suspense fallback={<Loader icon="puff" />}>
          <UnAuthorizedPage />
        </Suspense>
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: "*",
      element: !auth.token ? (
        <Navigate to={`/login`} replace />
      ) : (
        <Suspense fallback={<Loader icon="puff" />}>
          <ErrorPage />
        </Suspense>
      ),
    },
  ];
  return useRoutes(routes);
};
//Router file

function Router() {
  const darkMode = useAppSelector(selectDarkMode);

  return (
    <>
      {/* ToastContainer for displaying toast messages */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className={`${darkMode ? "text-white" : "text-black"}`}
        theme={darkMode ? "dark" : "light"}
      />

      <RenderRoutes />
    </>
  );
}

export default Router;
