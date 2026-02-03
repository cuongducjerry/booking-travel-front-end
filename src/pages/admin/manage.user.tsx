import TableUser from "@/components/admin/user/table.user";
import { hasPermission } from "@/utils/permission";


const ManageUserPage = () => {
    return (
        <div>
            <TableUser />
        </div>
    );
};

export default ManageUserPage;
