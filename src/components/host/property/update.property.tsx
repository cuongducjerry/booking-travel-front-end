import {
    Form,
    Input,
    Button,
    Upload,
    Card,
    Divider,
    App,
    Select,
    InputNumber,
    Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import {
    getAmenitiesAPI,
    getPropertyTypesAPI,
    uploadPropertyImagesAPI,
    deletePropertyImageAPI,
    updatePropertyAmenitiesAPI,
    submitPropertyAPI,
    updatePropertyAPI,
    getHostPropertyById,
    getDraftImageByPropertyId,
    deletePropertyImageDraftAPI,
} from "@/services/api";
import GoogleMapReact from "google-map-react";
import { useRef } from "react";

const { Title } = Typography;

interface Props {
    propertyId: number;
}

const HostUpdateProperty = ({ propertyId }: Props) => {
    const { message } = App.useApp();
    const [form] = Form.useForm();

    const [fileList, setFileList] = useState<any[]>([]);
    const [amenities, setAmenities] = useState<number[]>([]);
    const [amenityList, setAmenityList] = useState<any[]>([]);
    const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
    const [status, setStatus] = useState<string>("");
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    /* ================= LOAD DETAIL ================= */
    useEffect(() => {
        if (propertyId) {
            loadDetail();
            loadMasterData();
        }
    }, [propertyId]);

    const loadDetail = async () => {
        try {
            const [res, resImageDraft] = await Promise.all([
                getHostPropertyById(String(propertyId)),
                getDraftImageByPropertyId(String(propertyId))
            ]);

            const p = res?.data;
            const draftImages = resImageDraft?.data ?? [];

            if (!p) {
                message.error("Không tìm thấy property");
                return;
            }

            if (typeof p.latitude === "number" && typeof p.longitude === "number") {
                const lat = Number(p.latitude);
                const lng = Number(p.longitude);

                setLocation({ lat, lng });

                form.setFieldsValue({
                    latitude: lat,
                    longitude: lng,
                });
            }

            const normalizedStatus = String(p.status || "").toUpperCase();
            setStatus(normalizedStatus);

            form.setFieldsValue({
                title: p.title,
                description: p.description,
                address: p.address,
                city: p.city,
                pricePerNight: p.pricePerNight,
                currency: p.currency,
                maxGuests: p.maxGuests,
                propertyTypeId: p.propertyTypeId,
            });

            setAmenities((p.amenities ?? []).map((a: any) => a.amenityId));

            /* ================= IMAGES ================= */

            const baseImages = (p.images ?? []).map((img: any) => ({
                uid: `db-${img.id}`,
                name: `image-${img.id}`,
                status: "done",
                url: img.imageUrl,
                imageId: img.id,
            }));

            const draftImageFiles = (draftImages ?? []).map((img: any) => ({
                uid: `draft-${img.id}`,
                name: `draft-image-${img.id}`,
                status: "done",
                url: img.imageUrl,
                imageId: img.id,
                isDraft: true, // optional flag
            }));

            setFileList([
                ...baseImages,
                ...draftImageFiles
            ]);

        } catch (err) {
            console.error(err);
            message.error("Load property thất bại");
        }
    };


    const loadMasterData = async () => {
        try {
            const [amenRes, typeRes] = await Promise.all([
                getAmenitiesAPI({ page: 0, size: 1000 }),
                getPropertyTypesAPI({ page: 0, size: 1000 }),
            ]);

            setAmenityList(amenRes?.data?.result ?? []);
            setPropertyTypes(typeRes?.data?.result ?? []);
        } catch (err) {
            console.error(err);
            message.error("Load master data failed!");
        }
    };

    /* ================= IMAGES ================= */
    const handleUpload = async ({ file, onSuccess, onError }: any) => {
        try {
            const res = await uploadPropertyImagesAPI(propertyId, [file]);

            const images = res.data ?? [];

            setFileList(prev => [
                ...prev,
                ...images.map((img: any) => ({
                    uid: `draft-${img.id}`,
                    name: file.name,
                    status: "done",
                    url: img.imageUrl,
                    imageId: img.id,
                    isDraft: true,
                })),
            ]);

            onSuccess?.("ok");
            message.success("Photo update successful");
        } catch (err) {
            message.error("Image upload failed");
            onError?.(err);
        }
    };

    const handleRemove = async (file: any) => {
        console.log("REMOVE FILE:", file);

        if (file.isDraft) {
            if (!file.imageId) {
                message.error("Lack of imageId (draft)");
                return false;
            }

            try {
                await deletePropertyImageDraftAPI(propertyId, file.imageId);
                setFileList(prev => prev.filter(f => f.uid !== file.uid));
                message.success("The photo has been deleted (draft)");
                return true;
            } catch {
                message.error("Deleting the draft image failed");
                return false;
            }
        }

        if (file.imageId) {
            try {
                await deletePropertyImageAPI(propertyId, file.imageId);
                setFileList(prev => prev.filter(f => f.imageId !== file.imageId));
                message.success("The photo has been deleted");
                return true;
            } catch {
                message.error("Photo deletion failed");
                return false;
            }
        }

        return false;
    };

    /* ================= UPDATE ================= */
    const onUpdateProperty = async (values: any) => {
        try {
            await updatePropertyAPI(propertyId, values);
            await updatePropertyAmenitiesAPI(propertyId, amenities);
            message.success("Property update successful");
            loadDetail();
        } catch (err: any) {
            message.error(err?.response?.data?.message || "Update failed");
        }
    };

    /* ================= SUBMIT ================= */
    const onSubmit = async () => {
        try {
            await submitPropertyAPI(propertyId);
            message.success("Property has been submitted for approval");
            loadDetail();
        } catch {
            message.error("Submit failed");
        }
    };

    interface MapMarkerProps {
        lat: number;
        lng: number;
    }

    const MapMarker: React.FC<MapMarkerProps> = () => {
        return (
            <div
                style={{
                    width: 20,
                    height: 20,
                    background: "#ff385c",
                    borderRadius: "50%",
                    border: "3px solid white",
                    transform: "translate(-50%, -50%)",
                }}
            />
        );
    };

    /* ================= RULES ================= */
    const isPending = status === "PENDING";
    const canSubmit = status === "DRAFT" || status === "REJECTED";

    return (
        <Card>
            <Title level={4}>Update Property</Title>

            <Form form={form} layout="vertical" onFinish={onUpdateProperty}>
                <Divider orientation="left">Information</Divider>

                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                    <Input disabled={isPending} />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={4} disabled={isPending} />
                </Form.Item>

                <Form.Item name="address" label="Address">
                    <Input disabled={isPending} />
                </Form.Item>

                <Form.Item name="city" label="City">
                    <Input disabled={isPending} />
                </Form.Item>

                <Form.Item name="propertyTypeId" label="Property Type">
                    <Select
                        disabled={isPending}
                        options={propertyTypes.map(t => ({
                            value: t.id,
                            label: t.name,
                        }))}
                    />
                </Form.Item>

                <Form.Item name="pricePerNight" label="Price / Night">
                    <InputNumber min={0} disabled={isPending} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="currency" label="Currency">
                    <Select
                        disabled={isPending}
                        options={[
                            { value: "VND", label: "VND" },
                            { value: "USD", label: "USD" },
                        ]}
                    />
                </Form.Item>

                <Form.Item name="maxGuests" label="Max Guests">
                    <InputNumber min={1} disabled={isPending} style={{ width: "100%" }} />
                </Form.Item>

                <Divider orientation="left">Amenities</Divider>

                <Form.Item>
                    <Select
                        mode="multiple"
                        disabled={isPending}
                        value={amenities}
                        onChange={setAmenities}
                        style={{ width: "100%" }}
                        options={amenityList.map(a => ({
                            value: a.id,
                            label: a.name,
                        }))}
                    />
                </Form.Item>


                <Divider orientation="left">Location</Divider>

                <Form.Item label="Select a location on the map">
                    <div
                        style={{
                            height: 400,
                            width: "100%",
                            borderRadius: 8,
                            overflow: "hidden",
                        }}
                    >
                        <GoogleMapReact
                            bootstrapURLKeys={{
                                key: import.meta.env.VITE_GOOGLE_MAP_KEY as string,
                            }}
                            center={location ?? { lat: 16.0544, lng: 108.2022 }}
                            zoom={location ? 15 : 12}
                            onClick={({ lat, lng }: { lat: number; lng: number }) => {
                                if (isPending) return;

                                setLocation({ lat, lng });

                                form.setFieldsValue({
                                    latitude: lat,
                                    longitude: lng,
                                });
                            }}
                        >
                            {location && (
                                <MapMarker
                                    lat={location.lat}
                                    lng={location.lng}
                                />
                            )}
                        </GoogleMapReact>
                    </div>
                </Form.Item>

                <Form.Item name="latitude" hidden>
                    <Input />
                </Form.Item>

                <Form.Item name="longitude" hidden>
                    <Input />
                </Form.Item>



                <Divider orientation="left">Images</Divider>

                <Upload
                    listType="picture-card"
                    customRequest={handleUpload}
                    fileList={fileList}
                    onRemove={handleRemove}
                    disabled={isPending}
                >
                    <UploadOutlined />
                </Upload>

                <Divider />

                <Button type="primary" htmlType="submit" disabled={isPending}>
                    Update
                </Button>

                <Button
                    danger
                    style={{ marginLeft: 12 }}
                    onClick={onSubmit}
                    disabled={!canSubmit}
                >
                    Submit Property
                </Button>
            </Form>
        </Card>
    );
};

export default HostUpdateProperty;

