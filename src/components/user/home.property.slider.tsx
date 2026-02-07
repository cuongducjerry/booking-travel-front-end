import { formatVND } from "@/utils/format";
import { Empty } from "antd";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "styles/components/home.property.slider.scss";

interface Props {
    title?: string;
    properties: IProperty[];
}

const HomePropertySlider = ({ title = "Property", properties }: Props) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const scroll = (offset: number) => {
        sliderRef.current?.scrollBy({
            left: offset,
            behavior: "smooth",
        });
    };

    return (
        <div className="airbnb-slider-wrapper">
            <div className="slider-header">
                <h2 className="slider-title">{title}</h2>

                {properties.length > 0 && (
                    <div className="slider-actions">
                        <button onClick={() => scroll(-325)}>‹</button>
                        <button onClick={() => scroll(325)}>›</button>
                    </div>
                )}
            </div>

            <div className="airbnb-slider" ref={sliderRef}>
                {properties.length > 0 ? (
                    properties.map(item => (
                        <div className="slider-item" key={item.id}
                            onClick={() => navigate(`/property/${item.id}`)}
                        >
                            <div className="property-card">
                                <img src={item.images?.[0].imageUrl} alt={item.title} />
                                <h3>{item.title}</h3>
                                <p>{item.address}</p>
                                <span>
                                    <strong>{formatVND(item.pricePerNight)}</strong> / night
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-center">
                        <Empty description={`Chưa có ${title}`} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePropertySlider;
