import HostUpdateProperty from "@/components/host/property/update.property";
import { Navigate, useParams } from "react-router-dom";


const HostUpdatePropertyPage = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <HostUpdateProperty propertyId={Number(id)} />
    );
};

export default HostUpdatePropertyPage;