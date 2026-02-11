import { Row, Col, Spin, Pagination, Empty } from "antd";
import PropertyCard from "components/user/search/property.card";

interface PropertyListProps {
    properties: any[];
    loading: boolean;
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number, pageSize: number) => void;
}

const PropertyList = ({
    properties,
    loading,
    total,
    page,
    pageSize,
    onPageChange,
}: PropertyListProps) => {
    if (loading)
        return (
            <div style={{ padding: 40, textAlign: "center" }}>
                <Spin size="large" />
            </div>
        );

    if (!properties.length) {
        return (
            <div
                style={{
                    height: "100%",
                    minHeight: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Empty />
            </div>
        );
    }


    return (
        <div style={{ paddingRight: 24 }}>
            <Row
                gutter={[24, 24]}
                justify="start"
            >
                {properties.map((p) => (
                    <Col
                        key={p.id}
                        flex="0 0 360px"
                        style={{ display: "flex", justifyContent: "center" }}
                    >
                        <PropertyCard propertyId={p.id} />
                    </Col>
                ))}
            </Row>

            <div
                style={{
                    marginTop: 48,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={total}
                    onChange={onPageChange}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default PropertyList;