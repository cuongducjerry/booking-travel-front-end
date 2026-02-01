
import ProfileDetail from "@/components/user/profile.page";
import { getUserById } from "@/services/api";
import { App } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
    const { id } = useParams();
    const { notification } = App.useApp();

    const [currentUser, setCurrentUser] = useState<IUserDetail | null>(null);


    useEffect(() => {
        if (!id) return;

        const fetchUserById = async () => {
            try {
                const res = await getUserById(id);

                if (res && res.data) {
                    setCurrentUser(res.data);
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

        fetchUserById();
    }, [id]);

    return (
        <ProfileDetail user={currentUser} />
    );
};

export default ProfilePage;