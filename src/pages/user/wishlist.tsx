import { useEffect, useState } from "react";
import { Empty, Pagination, Row, Col, message } from "antd";
import { getMyWishlistAPI } from "@/services/api";
import PropertyCard from "@/components/user/search/property.card";

const MyWishlist = () => {
    const [data, setData] = useState<IResPropertyWishlist[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 8;

    const fetchWishlist = async (p = 1) => {
        try {
            const res = await getMyWishlistAPI({
                page: p - 1,
                size: pageSize,
            });

            setData(res.data?.result ?? []);
            setTotal(res.data?.meta.total ?? 0);
        } catch {
            message.error("Không tải được wishlist");
        }
    };

    useEffect(() => {
        fetchWishlist(page);
    }, [page]);

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{marginBottom: 30}}>❤️ Danh sách yêu thích</h2>

            {data.length === 0 ? (
                <Empty description="Chưa có bất động sản yêu thích" />
            ) : (
                <>
                    <Row gutter={[16, 16]}>
                        {data.map((p) => (
                            <Col key={p.propertyId} xs={24} sm={12} md={8} lg={6}>
                                <PropertyCard propertyId={p.propertyId} />
                            </Col>
                        ))}
                    </Row>

                    <Pagination
                        style={{ marginTop: 24, textAlign: "center" }}
                        current={page}
                        pageSize={pageSize}
                        total={total}
                        onChange={setPage}
                    />
                </>
            )}
        </div>
    );
};

export default MyWishlist;