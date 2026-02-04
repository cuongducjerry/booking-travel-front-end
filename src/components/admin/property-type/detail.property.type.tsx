import { FORMATE_DATE_VN } from "@/services/helper";
import { Descriptions, Drawer, Tag } from "antd";
import dayjs from "dayjs";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IPropertyType | null;
    setDataViewDetail: (v: IPropertyType | null) => void;
}

const DetailPropertyType = (props: IProps) => {
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

    return (
        <Drawer
            title="Chức năng xem chi tiết"
            width="50vw"
            onClose={onClose}
            open={openViewDetail}
        >
            <Descriptions
                title="Thông tin Property Type"
                bordered
                column={2}
            >
                <Descriptions.Item label="ID">
                    {dataViewDetail?.id}
                </Descriptions.Item>

                <Descriptions.Item label="Name">
                    {dataViewDetail?.name}
                </Descriptions.Item>

                <Descriptions.Item label="Created By">
                    <Tag color="blue">
                        {dataViewDetail?.createdBy ?? '--'}
                    </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Updated By">
                    <Tag color="gold">
                        {dataViewDetail?.updatedBy ?? '--'}
                    </Tag>
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
    );
};

export default DetailPropertyType;