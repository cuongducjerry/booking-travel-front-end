import {
    Tabs,
    Form,
    Input,
    Button,
    Upload,
    Card,
    Divider,
    App,
    Select,
    Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
    createPropertyAPI,
    uploadPropertyImagesAPI,
    deletePropertyImageAPI,
    updatePropertyAmenitiesAPI,
    submitPropertyAPI,
    getPropertyTypesAPI,
    getMyContractsAPI,
} from "@/services/api";
import { hasPermission } from "@/utils/permission";
import { getAmenitiesAPI } from "@/services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    AMENITY_ICON_MAP,
    DEFAULT_AMENITY_ICON,
} from "@/utils/constants/amenity.icon";
import GoogleMapReact from "google-map-react";
import { useRef } from "react";

const { Title } = Typography;

const CreateProperty = () => {
    const { message, modal } = App.useApp();

    /* ================= PERMISSION ================= */
    const canCreate = hasPermission("PROPERTY_CREATE");
    const canUploadImage = hasPermission("PROPERTY_UPLOAD_IMAGE");
    const canDeleteImage = hasPermission("PROPERTY_DELETE_IMAGE");
    const canUpdateAmenity = hasPermission("PROPERTY_UPDATE_AMENITY");
    const canSubmit = hasPermission("PROPERTY_SUBMIT");

    /* ================= STATE ================= */
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const mapRef = useRef<any>(null);
    const mapsRef = useRef<any>(null);
    const [amenityList, setAmenityList] = useState<IAmenity[]>([]);
    const [activeTab, setActiveTab] = useState("1");
    const [propertyId, setPropertyId] = useState<number | null>(null);
    const [fileList, setFileList] = useState<any[]>([]);
    const [amenities, setAmenities] = useState<number[]>([]);
    const [propertyTypes, setPropertyTypes] = useState<IPropertyType[]>([]);
    const [contracts, setContracts] = useState<IHostContractTable[]>([]);
    const [form] = Form.useForm();

    /* ================= RESTORE PROPERTY ================= */
    useEffect(() => {
        const savedId = localStorage.getItem("creatingPropertyId");
        if (savedId) {
            const id = Number(savedId);
            if (!isNaN(id)) {
                setPropertyId(id);
                setActiveTab("2"); // quay lại tab ảnh sau reload
            }
        }
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const res = await getAmenitiesAPI({
                    page: 0,
                    size: 1000,
                });
                setAmenityList(res.data?.result ?? []);
            } catch (e) {
                message.error("Unable to load the list of amenities!");
            }
        })();
    }, []);

    /* ================= LOAD PROPERTY TYPE ================= */
    useEffect(() => {
        (async () => {
            const res = await getPropertyTypesAPI({ page: 0, size: 1000 });
            setPropertyTypes(res.data?.result ?? []);
        })();
    }, []);

    /* ================= LOAD CONTRACT ================= */
    useEffect(() => {
        (async () => {
            const res = await getMyContractsAPI({ page: 0, size: 1000 });
            const list = res.data?.result ?? [];
            setContracts(list.filter(c => c.status === "DRAFT" || c.status === "ACTIVE"));
        })();
    }, []);

    /* ================= STEP 1 ================= */
    const onCreateProperty = async (values: any) => {
        if (!values.latitude || !values.longitude) {
            message.error("Please select a location on the map");
            return;
        }

        if (!canCreate) return;

        const res = await createPropertyAPI(values);
        const id = res?.data?.id;

        if (!id) {
            message.error("Property cannot be created");
            return;
        }

        setPropertyId(id);
        localStorage.setItem("creatingPropertyId", String(id));

        message.success("Color creation successful");
        setActiveTab("2");
    };

    /* ================= STEP 2: UPLOAD ================= */
    const handleUpload = async ({ file, onSuccess, onError }: any) => {
        if (!propertyId) {
            message.error("Property not yet created");
            return;
        }

        try {
            const res = await uploadPropertyImagesAPI(propertyId, [file]);

            // BE trả về: ResPropertyImage[]
            const images = res.data || [];

            setFileList(prev => [
                ...prev,
                ...images.map((img: any) => ({
                    uid: String(img.id),
                    name: file.name,
                    status: "done",
                    url: img.imageUrl,
                })),
            ]);

            onSuccess("ok");
            message.success("Image uploaded successfully");
        } catch (err) {
            onError(err);
            message.error("Upload failed");
        }
    };

    const onRemove = async (file: any) => {
        if (!propertyId || !canDeleteImage) return false;

        // optimistic UI
        setFileList(prev => prev.filter(item => item.uid !== file.uid));

        try {
            await deletePropertyImageAPI(propertyId, file.uid);
            message.success("Photo deleted successfully");
            return true;
        } catch (err) {
            message.error("Photo deletion failed!");
            return false;
        }
    };


    /* ================= STEP 3 ================= */
    const onSaveAmenities = async () => {
        if (!propertyId || !canUpdateAmenity) return;
        console.log(amenities);

        await updatePropertyAmenitiesAPI(propertyId, amenities);
        message.success("Saved the extension successfully");
        setActiveTab("4");
    };

    /* ================= STEP 4 ================= */
    const onSubmitProperty = async () => {
        if (!propertyId || !canSubmit) return;

        modal.confirm({
            title: "Submit property pending approval?",
            content: "Once submitted, you cannot edit it",
            onOk: async () => {
                await submitPropertyAPI(propertyId);
                localStorage.removeItem("creatingPropertyId");

                // reset state
                setPropertyId(null);
                setFileList([]);
                setAmenities([]);
                setActiveTab("1");

                message.success("Property has been submitted");
            },
        });
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

    return (
        <Card style={{ maxWidth: 800, margin: "40px auto" }}>
            <Title level={3}>Add Property</Title>
            <Divider />

            <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
                {/* TAB 1 */}
                <Tabs.TabPane tab="Information" key="1">
                    <Form layout="vertical" form={form} onFinish={onCreateProperty}>
                        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Description" name="description">
                            <Input.TextArea />
                        </Form.Item>

                        <Form.Item label="Address" name="address">
                            <Input />
                        </Form.Item>

                        <Form.Item label="City" name="city">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Price Per Night" name="pricePerNight">
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item label="Currency" name="currency">
                            <Select
                                options={[
                                    { label: "VND", value: "VND" },
                                    { label: "USD", value: "USD" },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item label="Max Guests" name="maxGuests">
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item label="Property Type" name="propertyTypeId">
                            <Select
                                options={propertyTypes.map(p => ({
                                    label: p.name,
                                    value: p.id,
                                }))}
                            />
                        </Form.Item>

                        <Form.Item label="Contract" name="contractId">
                            <Select
                                options={contracts.map(c => ({
                                    label: `${c.contractCode} (${c.status})`,
                                    value: c.id,
                                }))}
                            />
                        </Form.Item>

                        <Divider />

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
                                    defaultCenter={{ lat: 16.0544, lng: 108.2022 }}
                                    defaultZoom={12}
                                    onClick={({ lat, lng }: { lat: number; lng: number }) => {
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

                        {/* Hidden fields để submit */}
                        <Form.Item name="latitude" hidden>
                            <Input />
                        </Form.Item>

                        <Form.Item name="longitude" hidden>
                            <Input />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" block>
                            Create Property
                        </Button>
                    </Form>
                </Tabs.TabPane>

                {/* TAB 2 */}
                <Tabs.TabPane tab="Image" key="2" disabled={!propertyId}>
                    <Upload
                        customRequest={handleUpload}
                        listType="picture-card"
                        fileList={fileList}
                        onRemove={onRemove}
                        disabled={!propertyId}
                    >
                        {propertyId && canUploadImage && <UploadOutlined />}
                    </Upload>
                </Tabs.TabPane>

                {/* TAB 3 */}
                <Tabs.TabPane tab="Amenities" key="3" disabled={!propertyId}>
                    <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Choose amenity for the property"
                        value={amenities}
                        onChange={setAmenities}
                        optionFilterProp="label"
                        options={amenityList.map(a => ({
                            value: a.id,
                            label: (
                                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <FontAwesomeIcon
                                        icon={AMENITY_ICON_MAP[a.icon] || DEFAULT_AMENITY_ICON}
                                        style={{ color: "#1677ff" }}
                                    />
                                    {a.name}
                                </span>
                            ),
                        }))}
                    />

                    <Button
                        type="primary"
                        onClick={onSaveAmenities}
                        style={{ marginTop: 16 }}
                        disabled={!canUpdateAmenity}
                    >
                        Save Amenities
                    </Button>
                </Tabs.TabPane>

                {/* TAB 4 */}
                <Tabs.TabPane tab="Complete" key="4" disabled={!propertyId}>
                    <Button type="primary" danger onClick={onSubmitProperty}>
                        Send Property
                    </Button>
                </Tabs.TabPane>
            </Tabs>
        </Card>
    );
};

export default CreateProperty;

