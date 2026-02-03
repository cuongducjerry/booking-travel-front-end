import TablePermission from "@/components/admin/permission/table.permission";
import { hasPermission } from "@/utils/permission";

const ManagePermissionPage = () => {
    return (
        <div>
            <TablePermission/>
        </div>
    )
}

export default ManagePermissionPage;