import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react"


const AdminDashboard = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countUser: 0,
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
                        title="Tổng Users"
                        value={dataDashboard.countUser}
                    />
                </Card>
            </Col>
        </Row>
    )

}

export default AdminDashboard;