import "styles/components/property.detail.scss";
import {
    EnvironmentOutlined,
    UserOutlined,
    HomeOutlined,
    TeamOutlined
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { Button, Tag, Avatar, Divider, Empty, DatePicker, Select, InputNumber } from "antd";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    AMENITY_ICON_MAP,
    DEFAULT_AMENITY_ICON
} from "@/utils/constants/amenity.icon";
import { Modal, Carousel } from "antd";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { formatVND } from "@/utils/format";
import { useNavigate } from "react-router-dom";

interface IProps {
    currentProperty: IPropertyDetail | null;
}

const PropertyDetail = ({ currentProperty }: IProps) => {
    const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [guests, setGuests] = useState<number>(1);
    const [openGallery, setOpenGallery] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
    dayjs.extend(isSameOrAfter);
    dayjs.extend(isSameOrBefore);

    if (!currentProperty) return <Empty />;

    const {
        title,
        description,
        address,
        city,
        images,
        pricePerNight,
        maxGuests,
        propertyType,
        amenities,
        status,
        host,
        bookings
    } = currentProperty;

    // ================= BOOKING LOGIC =================
    const isDateBooked = (date: Dayjs) => {
        return bookings?.some(b =>
            date.isSameOrAfter(dayjs(b.checkIn), "day") &&
            date.isSameOrBefore(dayjs(b.checkOut).subtract(1, "day"), "day")
        );
    };

    return (
        <div className="property-detail">
            {/* ===== HEADER ===== */}
            <h1 className="property-title">{title}</h1>

            <div className="property-location">
                <EnvironmentOutlined />
                <span>{address}, {city}</span>
                <Tag color="pink">{propertyType}</Tag>
                <Tag color={status === "APPROVED" ? "green" : "orange"}>
                    {status}
                </Tag>
            </div>

            {/* ===== GALLERY ===== */}
            <div className="property-gallery">
                <img
                    src={images?.[0]}
                    className="main-img"
                    alt={title}
                    onClick={() => {
                        setActiveIndex(0);
                        setOpenGallery(true);
                    }}
                />

                <div className="sub-images">
                    {images?.slice(1, 5).map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`${title}-${idx + 1}`}
                            onClick={() => {
                                setActiveIndex(idx + 1);
                                setOpenGallery(true);
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* ===== CONTENT ===== */}
            <div className="property-content">
                {/* LEFT */}
                <div className="property-info">

                    {/* HOST */}
                    <div className="host-info" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <Avatar
                            size={56}
                            src={host.avatarUrl || undefined}
                            style={{ backgroundColor: "#ff385c", fontWeight: 600 }}
                        >
                            {!host.avatarUrl && host.hostName.charAt(0).toUpperCase()}
                        </Avatar>

                        <div>
                            <h3 style={{ marginBottom: 4 }}>Hosted by {host.hostName}</h3>
                            <p style={{ margin: 0, color: "#555" }}>
                                <TeamOutlined /> {maxGuests} guests ·{" "}
                                <HomeOutlined /> {propertyType}
                            </p>
                        </div>
                    </div>

                    <Divider />

                    {/* HIGHLIGHTS */}
                    <div className="property-highlights">
                        <div>
                            <UserOutlined />
                            <span>Up to {maxGuests} guests</span>
                        </div>
                        <div>
                            <HomeOutlined />
                            <span>Entire {propertyType}</span>
                        </div>
                        <div>
                            <EnvironmentOutlined />
                            <span>{city}</span>
                        </div>
                    </div>

                    <Divider />

                    {/* DESCRIPTION */}
                    <h2>About this place</h2>
                    <p className="property-description">
                        {description}
                    </p>

                    <Divider />

                    {/* AMENITIES */}
                    <h2>Amenities</h2>
                    {amenities && amenities.length > 0 ? (
                        <div className="amenities">
                            {amenities.map((a) => {
                                const icon =
                                    AMENITY_ICON_MAP[a.amenityIcon] || DEFAULT_AMENITY_ICON;

                                return (
                                    <div key={a.amenityId} className="amenity-item">
                                        <FontAwesomeIcon icon={icon} />
                                        <span>{a.amenityName}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <Empty description="No amenities listed" />
                    )}

                    <Divider />

                    {/* REVIEWS */}
                    <h2>Reviews</h2>
                    <Empty description="No reviews yet" />
                    <Divider />
                </div>

                {/* RIGHT – BOOKING */}
                {/* ===== BOOKING BOX ===== */}
                <div className="booking-box">
                    <strong
                        style={{
                            display: "block",
                            fontSize: 22,
                            fontWeight: 600,
                            padding: "12px 0",
                            marginBottom: 16
                        }}
                    >
                        <strong>{formatVND(pricePerNight)}</strong> / night
                    </strong>

                    <DatePicker.RangePicker
                        value={dates}
                        onChange={setDates}
                        format="DD/MM/YYYY"
                        style={{ width: "100%" }}
                        disabledDate={(current) =>
                            !current ||
                            current < dayjs().startOf("day") ||
                            isDateBooked(current)
                        }
                        cellRender={(current, info) => {
                            if (info.type !== "date") return info.originNode;

                            if (dayjs.isDayjs(current) && isDateBooked(current)) {
                                return (
                                    <div
                                        style={{
                                            textDecoration: "line-through",
                                            color: "#bbb",
                                            cursor: "not-allowed",
                                        }}
                                    >
                                        {current.date()}
                                    </div>
                                );
                            }

                            return info.originNode;
                        }}
                    />

                    <InputNumber
                        min={1}
                        max={maxGuests}
                        value={guests}
                        onChange={(v) => setGuests(v || 1)}
                        style={{ width: "100%", marginTop: 12 }}
                    />

                    <Divider/>

                    <Button

                        type="primary"
                        block
                        size="large"
                        disabled={!dates}
                        onClick={() => {
                            if (!dates?.[0] || !dates?.[1]) return;

                            navigate(`/booking/${currentProperty.id}`, {
                                state: {
                                    checkIn: dates[0].format("YYYY-MM-DD"),
                                    checkOut: dates[1].format("YYYY-MM-DD"),
                                },
                            });
                        }}
                    >
                        Reserve
                    </Button>
                </div>
            </div>

            <Modal
                open={openGallery}
                footer={null}
                onCancel={() => setOpenGallery(false)}
                width={900}
                centered
                destroyOnClose
            >
                <Carousel
                    initialSlide={activeIndex}
                    arrows
                    dots
                    infinite
                >
                    {images?.map((img, idx) => (
                        <div key={idx} className="gallery-slide">
                            <img
                                src={img}
                                alt={`gallery-${idx}`}
                                className="gallery-img"
                            />
                        </div>
                    ))}
                </Carousel>
            </Modal>

        </div>


    );
};

export default PropertyDetail;
