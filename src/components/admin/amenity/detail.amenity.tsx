import { FORMATE_DATE_VN } from "@/services/helper";
import { Badge, Descriptions, Drawer, Tag } from "antd";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    AMENITY_ICON_MAP,
    DEFAULT_AMENITY_ICON
} from "@/utils/constants/amenity.icon";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IAmenity | null;
    setDataViewDetail: (v: IAmenity | null) => void;
}

const DetailAmenity = (props: IProps) => {
    const {
        openViewDetail,
        setOpenViewDetail,
        dataViewDetail,
        setDataViewDetail
    } = props;

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    const icon =
        dataViewDetail?.icon
            ? AMENITY_ICON_MAP[dataViewDetail.icon] || DEFAULT_AMENITY_ICON
            : DEFAULT_AMENITY_ICON;

    return (
        <Drawer
            title="Amenity Detail"
            width="50vw"
            onClose={onClose}
            open={openViewDetail}
        >
            <Descriptions
                title="Thông tin tiện ích"
                bordered
                column={2}
            >
                <Descriptions.Item label="ID">
                    {dataViewDetail?.id}
                </Descriptions.Item>

                <Descriptions.Item label="Tên tiện ích">
                    {dataViewDetail?.name}
                </Descriptions.Item>

                <Descriptions.Item label="Icon">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <FontAwesomeIcon icon={icon} fontSize={22} />
                        <Tag color="blue">{dataViewDetail?.icon}</Tag>
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label="Created By">
                    {dataViewDetail?.createdBy || "--"}
                </Descriptions.Item>

                <Descriptions.Item label="Updated By">
                    {dataViewDetail?.updatedBy || "--"}
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

export default DetailAmenity;
