import {
    Steps,
    Button,
    Radio,
    message,
    Card,
    Descriptions,
    Space,
    Typography,
} from "antd";
import { useLocation, useParams } from "react-router-dom";
import { createBooking, createVnpay, mockCallBackVnpay, payAtProperty } from "@/services/api";
import { useState } from "react";

const { Step } = Steps;
const { Title, Text } = Typography;

const BookingPage = () => {
    const { propertyId } = useParams<{ propertyId: string }>();
    const location = useLocation();
    const { checkIn, checkOut } = location.state || {};

    const numericPropertyId = Number(propertyId);
    if (!propertyId || Number.isNaN(numericPropertyId)) {
        return <Text type="danger">Invalid property</Text>;
    }

    const [current, setCurrent] = useState(0);
    const [booking, setBooking] = useState<IBookingDetail | undefined>(undefined);
    const [paymentType, setPaymentType] =
        useState<"VNPAY" | "CASH">("VNPAY");
    const [loading, setLoading] = useState(false);

    // ===== STEP 1 =====
    const handleCreateBooking = async () => {
        try {
            setLoading(true);
            const res = await createBooking({
                propertyId: numericPropertyId,
                checkIn,
                checkOut,
            });
            setBooking(res.data);
            setCurrent(1);
        } catch {
            message.error("Booking failed");
        } finally {
            setLoading(false);
        }
    };

    // ===== STEP 2 =====
    const handlePayment = async () => {
        if (!booking) return;

        try {
            setLoading(true);

            if (paymentType === "VNPAY") {
                // 1. Create VNPay payment
                const res = await createVnpay(booking.id);

                const paymentData = res.data;
                if (!paymentData) return;

                const { paymentId, urlPay } = paymentData;

                console.log("VNPay URL (blocked locally):", urlPay);

                // 2. MOCK CALLBACK SUCCESS
                const callbackRes = await mockCallBackVnpay(paymentId, true);

                message.success(callbackRes.data?.message ?? "Payment successful");

                // 3. Update UI
                setBooking({
                    ...booking,
                    status: "CONFIRMED",
                });

                setCurrent(2);
            } else {
                await payAtProperty(booking.id);
                setBooking({
                    ...booking,
                    status: "PENDING",
                });
                setCurrent(2);
            }
        } catch {
            message.error("Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: "40px auto" }}>
            <Steps current={current} style={{ marginBottom: 32 }}>
                <Step title="Booking" />
                <Step title="Payment" />
                <Step title="Completed" />
            </Steps>

            {/* ===== STEP 0 ===== */}
            {current === 0 && (
                <Card>
                    <Title level={4}>Confirm your booking</Title>

                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Property ID">
                            {numericPropertyId}
                        </Descriptions.Item>
                        <Descriptions.Item label="Check in">
                            {checkIn}
                        </Descriptions.Item>
                        <Descriptions.Item label="Check out">
                            {checkOut}
                        </Descriptions.Item>
                    </Descriptions>

                    <Button
                        type="primary"
                        block
                        size="large"
                        loading={loading}
                        style={{ marginTop: 24 }}
                        onClick={handleCreateBooking}
                    >
                        Create booking
                    </Button>
                </Card>
            )}

            {/* ===== STEP 1 ===== */}
            {current === 1 && booking && (
                <Card>
                    <Title level={4}>Payment</Title>

                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Property">
                            {booking.propertyName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Nights">
                            {booking.nights}
                        </Descriptions.Item>
                        <Descriptions.Item label="Total">
                            <Text strong>
                                {booking.grossAmount.toLocaleString()}{" "}
                                {booking.currency}
                            </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            {booking.status}
                        </Descriptions.Item>
                    </Descriptions>

                    <Space direction="vertical" size="middle" style={{ width: "100%", marginTop: 24 }}>
                        <Radio.Group
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                        >
                            <Radio value="VNPAY">VNPay</Radio>
                            <Radio value="CASH">Pay at property</Radio>
                        </Radio.Group>

                        <Button
                            type="primary"
                            size="large"
                            block
                            loading={loading}
                            onClick={handlePayment}
                        >
                            Pay now
                        </Button>
                    </Space>
                </Card>
            )}

            {/* ===== STEP 2 ===== */}
            {current === 2 && booking && (
                <Card style={{ textAlign: "center" }}>
                    <Title level={3}>🎉 Booking completed!</Title>
                    <Text>
                        Booking #{booking.id} – Status:{" "}
                        <Text strong>{booking.status}</Text>
                    </Text>
                </Card>
            )}
        </div>
    );
};

export default BookingPage;
