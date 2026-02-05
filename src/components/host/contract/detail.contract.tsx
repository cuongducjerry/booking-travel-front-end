import { FORMATE_DATE_VN } from "@/services/helper";
import { Badge, Descriptions, Drawer, Tag } from "antd";
import dayjs from "dayjs";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IHostContractTable | null;
  setDataViewDetail: (v: IHostContractTable | null) => void;
}

const DetailContract = (props: IProps) => {
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

  return (
    <Drawer
      title="Contract Detail"
      width={"60vw"}
      onClose={onClose}
      open={openViewDetail}
    >
      <Descriptions bordered column={2} title="Contract Information">
        <Descriptions.Item label="ID">
          {dataViewDetail?.id}
        </Descriptions.Item>

        <Descriptions.Item label="Contract Code">
          {dataViewDetail?.contractCode}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Badge
            status={
              dataViewDetail?.status === "ACTIVE"
                ? "success"
                : dataViewDetail?.status === "TERMINATED"
                ? "error"
                : "processing"
            }
            text={dataViewDetail?.status}
          />
        </Descriptions.Item>

        <Descriptions.Item label="Commission Rate">
          {dataViewDetail?.commissionRate} %
        </Descriptions.Item>

        <Descriptions.Item label="Start Date">
          {dataViewDetail?.startDate
            ? dayjs(dataViewDetail.startDate).format(FORMATE_DATE_VN)
            : "--"}
        </Descriptions.Item>

        <Descriptions.Item label="End Date">
          {dataViewDetail?.endDate
            ? dayjs(dataViewDetail.endDate).format(FORMATE_DATE_VN)
            : "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Signed At">
          {dataViewDetail?.signedAt
            ? dayjs(dataViewDetail.signedAt).format(FORMATE_DATE_VN)
            : "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Terminated At">
          {dataViewDetail?.terminatedAt
            ? dayjs(dataViewDetail.terminatedAt).format(FORMATE_DATE_VN)
            : "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Termination Reason" span={2}>
          {dataViewDetail?.terminationReason ?? "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Host">
          {dataViewDetail?.hostName}
        </Descriptions.Item>

        <Descriptions.Item label="Active">
          <Badge
            status={dataViewDetail?.active ? "success" : "error"}
            text={dataViewDetail?.active ? "Active" : "Inactive"}
          />
        </Descriptions.Item>

        <Descriptions.Item label="Properties" span={2}>
          {dataViewDetail?.properties?.length ? (
            dataViewDetail.properties.map((p) => (
              <Tag key={p.id}>
                {p.title} - {p.propertyTypeName}
              </Tag>
            ))
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

export default DetailContract;