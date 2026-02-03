import { FORMATE_DATE_VN } from "@/services/helper";
import { Avatar, Badge, Descriptions, Drawer } from "antd";
import dayjs from "dayjs";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IUserTable | null;
    setDataViewDetail: (v: IUserTable | null) => void;
}

const DetailUser = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }

    return (
        <>
            <Drawer
                title="Chức năng xem chi tiết"
                width={"50vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin user"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataViewDetail?.id}</Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị">{dataViewDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{dataViewDetail?.phone}</Descriptions.Item>

                    <Descriptions.Item label="Role">
                        <Badge status="processing" text={dataViewDetail?.role.name} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Avatar">
                        <Avatar size={40} src={dataViewDetail?.avatarUrl}>USER</Avatar>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {dataViewDetail?.createdAt
                            ? dayjs(dataViewDetail.createdAt).format(FORMATE_DATE_VN)
                            : '--'}
                    </Descriptions.Item>

                    <Descriptions.Item label="Updated At">
                        {dataViewDetail?.updatedAt
                            ? dayjs(dataViewDetail.updatedAt).format(FORMATE_DATE_VN)
                            : '--'}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )

}

export default DetailUser;