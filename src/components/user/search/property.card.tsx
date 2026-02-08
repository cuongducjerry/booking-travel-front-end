import {
    getPropertyById,
    toggleWishlistAPI,
    checkWishlistAPI,
} from "@/services/api";
import { formatVND } from "@/utils/format";
import { Card, message } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IProps {
    propertyId: number;
}

const PropertyCard = ({ propertyId }: IProps) => {
    const navigate = useNavigate();

    const [p, setP] = useState<IPropertyDetail | null>(null);
    const [liked, setLiked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!propertyId) return;

        const fetchData = async () => {
            try {
                const [propertyRes, wishlistRes] = await Promise.all([
                    getPropertyById(String(propertyId)),
                    checkWishlistAPI(propertyId),
                ]);

                setP(propertyRes.data || null);
                setLiked(wishlistRes.data ?? false);
            } catch (err) {
                console.error("Load property failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [propertyId]);

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            await toggleWishlistAPI(propertyId);
            setLiked(prev => !prev);

            message.success(
                !liked
                    ? "Đã thêm vào danh sách yêu thích ❤️"
                    : "Đã xóa khỏi danh sách yêu thích"
            );
        } catch {
            message.error("Không thể cập nhật wishlist");
        }
    };

    if (loading || !p) return null;

    return (
        <Card
            hoverable
            onClick={() => navigate(`/property/${p.id}`)}
            style={{
                height: 360,
                display: "flex",
                flexDirection: "column",
            }}
            cover={
                <div
                    style={{
                        position: "relative",
                        height: 220,
                        overflow: "hidden",
                    }}
                >
                    <img
                        alt={p.title}
                        src={p.images?.[0] || "/no-image.jpg"}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />

                    {/* ❤️ HEART */}
                    <div
                        onClick={toggleWishlist}
                        style={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            width: 36,
                            height: 36,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.9)",
                            cursor: "pointer",
                            zIndex: 10,
                        }}
                    >
                        {liked ? (
                            <HeartFilled style={{ color: "red", fontSize: 20 }} />
                        ) : (
                            <HeartOutlined style={{ fontSize: 20 }} />
                        )}
                    </div>
                </div>
            }
            bodyStyle={{
                flex: 1,
                padding: 12,
            }}
        >
            <h3
                style={{
                    marginBottom: 6,
                    fontSize: 15,
                    fontWeight: 500,
                    lineHeight: "20px",
                    height: 40,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {p.title}
            </h3>

            <p
                style={{
                    marginBottom: 10,
                    color: "#8c8c8c",
                    fontSize: 13,
                    lineHeight: "18px",
                    height: 18,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                }}
            >
                {p.address}
            </p>

            <div style={{ marginTop: "auto" }}>
                <strong style={{ fontSize: 15 }}>
                    {formatVND(p.pricePerNight)}
                </strong>
                <span style={{ fontSize: 13, color: "#555" }}> / night</span>
            </div>
        </Card>
    );
};

export default PropertyCard;


