import { Button, Result } from "antd";
import { useCurrentApp } from "components/context/app.context";
import { Link, useLocation } from "react-router-dom";
import { hasPermission } from "@/utils/permission.ts";

interface IProps {
    children: React.ReactNode;
    permission?: string[];
}

const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated } = useCurrentApp();

    // Chưa đăng nhập
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

    // Check permission (AND)
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