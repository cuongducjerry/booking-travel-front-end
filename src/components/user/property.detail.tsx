import "styles/components/property.detail.scss";
import {
    EnvironmentOutlined,
    UserOutlined,
    HomeOutlined,
    TeamOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { Button, Tag, Avatar, Divider, Empty, DatePicker, Select, InputNumber } from "antd";
import { useState } from "react";

interface IProps {
    currentProperty: IPropertyDetail | null;
}

const PropertyDetail = ({ currentProperty }: IProps) => {
    const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [guests, setGuests] = useState<number>(1);
    if (!currentProperty) return <Empty />;

    const {
        title,
        description,
        address,
        city,
        images,
        pricePerNight,
        currency,
        maxGuests,
        propertyType,
        amenities,
        status,
        host
    } = currentProperty;

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
                <img src={images?.[0]} className="main-img" />

                <div className="sub-images">
                    {images?.slice(1, 5).map((img, idx) => (
                        <img key={idx} src={img} />
                    ))}
                </div>
            </div>

            {/* ===== CONTENT ===== */}
            <div className="property-content">
                {/* LEFT */}
                <div className="property-info">

                    {/* HOST */}
                    <div className="host-info">
                        <div>
                            <h3>Hosted by {host.hostName}</h3>
                            <p>
                                <TeamOutlined /> {maxGuests} guests ·
                                <HomeOutlined /> {propertyType}
                            </p>
                        </div>

                        <Avatar size={56}>
                            {host.hostName.charAt(0)}
                        </Avatar>
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
                            {amenities.map((a) => (
                                <div key={a.id} className="amenity-item">
                                    <CheckCircleOutlined />
                                    <span>{a.name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Empty description="No amenities listed" />
                    )}

                    <Divider />

                    {/* REVIEWS */}
                    <h2>Reviews</h2>
                    <Empty description="No reviews yet" />
                </div>

                {/* RIGHT – BOOKING */}
                <div className="booking-box">
                    <div className="price">
                        <strong>{currency} {pricePerNight}</strong>
                        <span> / night</span>
                    </div>

                    {/* DATE PICKER */}
                    <div className="booking-dates">
                        <DatePicker.RangePicker
                            value={dates}
                            onChange={setDates}
                            format="DD/MM/YYYY"
                            style={{ width: "100%" }}
                            placeholder={["Check-in", "Check-out"]}
                            disabledDate={(current) =>
                                current && current < dayjs().startOf("day")
                            }
                        />
                    </div>

                    {/* GUESTS */}
                    <div className="booking-guests">
                        <label>Guests</label>
                        <InputNumber
                            min={1}
                            max={maxGuests}
                            value={guests}
                            onChange={(v) => setGuests(v || 1)}
                            style={{ width: "100%" }}
                        />
                    </div>

                    <Button
                        type="primary"
                        block
                        size="large"
                        disabled={!dates || !dates[0] || !dates[1]}
                    >
                        Reserve
                    </Button>

                    <p className="note">
                        You won’t be charged yet
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
