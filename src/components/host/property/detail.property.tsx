import { FORMATE_DATE_VN } from "@/services/helper";
import { Badge, Descriptions, Drawer, Image, Tag } from "antd";
import dayjs from "dayjs";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IPropertyTable | null;
  setDataViewDetail: (v: IPropertyTable | null) => void;
}

const DetailProperty = (props: IProps) => {
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
      title="Property Detail"
      width="70vw"
      onClose={onClose}
      open={openViewDetail}
    >
      <Descriptions bordered column={2} title="Basic Information">
        <Descriptions.Item label="ID">
          {dataViewDetail?.id}
        </Descriptions.Item>

        <Descriptions.Item label="Title">
          {dataViewDetail?.title}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Badge
            status={
              dataViewDetail?.status === "APPROVED"
                ? "success"
                : dataViewDetail?.status === "REJECTED"
                ? "error"
                : "processing"
            }
            text={dataViewDetail?.status}
          />
        </Descriptions.Item>

        <Descriptions.Item label="Property Type">
          {dataViewDetail?.propertyTypeName}
        </Descriptions.Item>

        <Descriptions.Item label="City">
          {dataViewDetail?.city}
        </Descriptions.Item>

        <Descriptions.Item label="Address">
          {dataViewDetail?.address}
        </Descriptions.Item>

        <Descriptions.Item label="Description" span={2}>
          {dataViewDetail?.description || "--"}
        </Descriptions.Item>
      </Descriptions>

      <br />

      <Descriptions bordered column={2} title="Pricing & Capacity">
        <Descriptions.Item label="Price / Night">
          {dataViewDetail
            ? `${dataViewDetail.pricePerNight.toLocaleString()} ${dataViewDetail.currency}`
            : "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Max Guests">
          {dataViewDetail?.maxGuests}
        </Descriptions.Item>
      </Descriptions>

      <br />

      <Descriptions bordered column={2} title="Host & Contract">
        <Descriptions.Item label="Host">
          {dataViewDetail?.hostName}
        </Descriptions.Item>

        <Descriptions.Item label="Contract ID">
          {dataViewDetail?.contractId ?? "--"}
        </Descriptions.Item>
      </Descriptions>

      <br />

      <Descriptions bordered column={2} title="Amenities">
        <Descriptions.Item span={2}>
          {dataViewDetail?.amenities?.length ? (
            dataViewDetail.amenities.map((a) => (
              <Tag key={a.amenityId}>{a.amenityName}</Tag>
            ))
          ) : (
            "--"
          )}
        </Descriptions.Item>
      </Descriptions>

      <br />

      <Descriptions bordered column={2} title="Bookings (Confirmed)">
        <Descriptions.Item span={2}>
          {dataViewDetail?.bookings?.length ? (
            dataViewDetail.bookings.map((b, index) => (
              <Tag key={index}>
                {dayjs(b.checkIn).format(FORMATE_DATE_VN)} →{" "}
                {dayjs(b.checkOut).format(FORMATE_DATE_VN)}
              </Tag>
            ))
          ) : (
            "--"
          )}
        </Descriptions.Item>
      </Descriptions>

      <br />

      <Descriptions bordered column={2} title="Images">
        <Descriptions.Item span={2}>
          {dataViewDetail?.images?.length ? (
            <Image.PreviewGroup>
              {dataViewDetail.images.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  width={120}
                  style={{ marginRight: 8 }}
                />
              ))}
            </Image.PreviewGroup>
          ) : (
            "--"
          )}
        </Descriptions.Item>
      </Descriptions>

      <br />

      <Descriptions bordered column={2} title="Meta">
        <Descriptions.Item label="Created At">
          {dataViewDetail?.createdAt
            ? dayjs(dataViewDetail.createdAt).format(FORMATE_DATE_VN)
            : "--"}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DetailProperty;