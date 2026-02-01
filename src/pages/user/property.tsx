
import PropertyDetail from "@/components/user/property.detail";
import { getPropertyById } from "@/services/api";
import { App } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PropertyPage = () => {
    const { id } = useParams();
    const { notification } = App.useApp();

    const [currentProperty, setCurrentProperty] = useState<IPropertyDetail | null>(null);


    useEffect(() => {
        if (!id) return;

        const fetchPropertyById = async () => {
            try {
                const res = await getPropertyById(id);

                if (res && res.data) {
                    setCurrentProperty(res.data);
                } else {
                    notification.error({
                        message: "Đã có lỗi xảy ra",
                        description: res?.message || "Không tìm thấy property",
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Đã có lỗi xảy ra",
                    description: "Không thể tải dữ liệu property",
                });
            } 
        };

        fetchPropertyById();
    }, [id]);

    return (
        <PropertyDetail currentProperty={currentProperty} />
    );
};

export default PropertyPage;
