import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react"


const HostDashboard = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countBooking: 0,
    })

    useEffect(() => {
        const initDashboard = async () => {

        }
        initDashboard();
    }, []);

    return (
        <Row gutter={[40, 40]}>
            <Col span={8}>
                <Card title="" bordered={false}>
                    <Statistic 
                        title="Tổng Bookings"
                        value={dataDashboard.countBooking}
                    />
                </Card>
            </Col>
        </Row>
    )

}

export default HostDashboard;