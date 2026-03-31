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
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  if (!dataViewDetail) return null;

  const getAge = (dob?: string) => {
    if (!dob) return "--";
    return dayjs().diff(dayjs(dob), "year");
  };

  return (
    <Drawer
      title="Chức năng xem chi tiết"
      width={"50vw"}
      onClose={onClose}
      open={openViewDetail}
    >
      <Descriptions title="Thông tin user" bordered column={2}>
        <Descriptions.Item label="Id">{dataViewDetail.id}</Descriptions.Item>

        <Descriptions.Item label="Tên hiển thị">
          {dataViewDetail.fullName}
        </Descriptions.Item>

        <Descriptions.Item label="Email">
          {dataViewDetail.email}
        </Descriptions.Item>

        <Descriptions.Item label="Số điện thoại">
          {dataViewDetail.phone || "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Địa chỉ">
          {dataViewDetail.address || "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Bio">
          {dataViewDetail.bio || "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày sinh">
          {dataViewDetail.dateOfBirth
            ? dayjs(dataViewDetail.dateOfBirth).format("DD/MM/YYYY")
            : "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Tuổi">
          {getAge(dataViewDetail.dateOfBirth)}
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái">
          <Badge
            status={
              dataViewDetail.status === "ACTIVE"
                ? "success"
                : dataViewDetail.status === "INACTIVE"
                  ? "default"
                  : "processing"
            }
            text={dataViewDetail.status}
          />
        </Descriptions.Item>

        <Descriptions.Item label="Role">
          <Badge status="processing" text={dataViewDetail.role?.name || "--"} />
        </Descriptions.Item>

        <Descriptions.Item label="Avatar">
          <Avatar size={40} src={dataViewDetail.avatarUrl}>
            {dataViewDetail.fullName?.charAt(0) || "U"}
          </Avatar>
        </Descriptions.Item>

        <Descriptions.Item label="Created At">
          {dataViewDetail.createdAt
            ? dayjs(dataViewDetail.createdAt).format(FORMATE_DATE_VN)
            : "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Updated At">
          {dataViewDetail.updatedAt
            ? dayjs(dataViewDetail.updatedAt).format(FORMATE_DATE_VN)
            : "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Created By">
          {dataViewDetail.createdBy || "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Updated By">
          {dataViewDetail.updatedBy || "--"}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DetailUser;
