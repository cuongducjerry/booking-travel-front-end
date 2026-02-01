import { formatVND } from "@/utils/format";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ p }: { p: IProperty }) => {
    const navigate = useNavigate();

    return (
        <Card
            hoverable
            onClick={() => navigate(`/property/${p.id}`)}
            cover={
                <img
                    alt={p.title}
                    src={p.images?.[0] || "/no-image.jpg"}
                    style={{
                        height: 220,
                        objectFit: "cover",
                    }}
                />
            }
        >
            <h3 style={{ marginBottom: 4 }}>{p.title}</h3>
            <p style={{ marginBottom: 8, color: "#888" }}>{p.address}</p>
            <b>
                <strong>{formatVND(p.pricePerNight)}</strong> / night
            </b>
        </Card>
    );
};

export default PropertyCard;