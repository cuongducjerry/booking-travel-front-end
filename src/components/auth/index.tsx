import { Button, Result } from "antd";
import { useCurrentApp } from "components/context/app.context";
import { Link, useLocation } from "react-router-dom";
import { hasPermission } from "@/utils/permission.ts";

interface IProps {
    children: React.ReactNode;
    permission?: string[];
    role?: Array<"USER" | "HOST" | "ADMIN" | "SUPER_ADMIN">;
}

const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();

    // ===== 1. CHECK LOGIN =====
    if (!isAuthenticated) {
        return (
            <Result
                status="404"
                title="Not Login"
                subTitle="Bạn vui lòng đăng nhập để sử dụng tính năng này."
                extra={
                    <Button type="primary">
                        <Link to="/login">Đăng nhập</Link>
                    </Button>
                }
            />
        );
    }

     // ===== 2. CHECK ROLE =====
    if (props.role && props.role.length > 0) {
        const hasRole = props.role.includes(user?.role as any);

        if (!hasRole) {
            return (
                <Result
                    status="403"
                    title="Access denied"
                    subTitle="Bạn không có vai trò phù hợp để truy cập chức năng này."
                    extra={
                        <Button type="primary">
                            <Link to="/">Trang chủ</Link>
                        </Button>
                    }
                />
            );
        }
    }

    // ===== 3. CHECK PERMISSION (AND) =====
    if (props.permission && props.permission.length > 0) {
        const hasAllPermissions = props.permission.every(p =>
            hasPermission(p)
        );

        if (!hasAllPermissions) {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Bạn không có quyền truy cập chức năng này."
                    extra={
                        <Button type="primary">
                            <Link to="/">Back Home</Link>
                        </Button>
                    }
                />
            );
        }
    }



    return <>{props.children}</>;
};

export default ProtectedRoute;