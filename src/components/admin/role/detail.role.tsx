import { FORMATE_DATE_VN } from "@/services/helper";
import { Badge, Descriptions, Drawer, Space, Tag } from "antd";
import dayjs from "dayjs";

interface IPermission {
    id: number;
    code: string;
}

interface IRole {
    id: number;
    name: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    permissions: IPermission[];
}

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IRole | null;
    setDataViewDetail: (v: IRole | null) => void;
}

const DetailRole = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    return (
        <Drawer
            title="Chức năng xem chi tiết Role"
            width="50vw"
            onClose={onClose}
            open={openViewDetail}
        >
            <Descriptions title="Thông tin Role" bordered column={2}>
                <Descriptions.Item label="Id">
                    {dataViewDetail?.id}
                </Descriptions.Item>

                <Descriptions.Item label="Tên Role">
                    <Badge status="processing" text={dataViewDetail?.name} />
                </Descriptions.Item>

                <Descriptions.Item label="Mô tả" span={2}>
                    {dataViewDetail?.description || "--"}
                </Descriptions.Item>

                <Descriptions.Item label="Permissions" span={2}>
                    {dataViewDetail?.permissions?.length ? (
                        <Space size={[8, 8]} wrap>
                            {dataViewDetail.permissions.map((p) => (
                                <Tag color="blue" key={p.id}>
                                    {p.code}
                                </Tag>
                            ))}
                        </Space>
                    ) : (
                        "--"
                    )}
                </Descriptions.Item>

                <Descriptions.Item label="Created At">
                    {dataViewDetail?.createdAt
                        ? dayjs(dataViewDetail.createdAt).format(FORMATE_DATE_VN)
                        : "--"}
                </Descriptions.Item>

                <Descriptions.Item label="Updated At">
                    {dataViewDetail?.updatedAt
                        ? dayjs(dataViewDetail.updatedAt).format(FORMATE_DATE_VN)
                        : "--"}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default DetailRole;