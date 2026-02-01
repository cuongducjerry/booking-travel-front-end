import GoogleMapReact from "google-map-react";

/* ========= TYPES ========= */
interface PropertyMapProps {
    properties: any[];
}

interface MarkerProps {
    lat: number;
    lng: number;
    text: string;
}

/* ========= MARKER ========= */
const Marker = ({ text }: MarkerProps) => (
    <div
        style={{
            color: "white",
            background: "#ff385c",
            padding: "6px 10px",
            borderRadius: 16,
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
            transform: "translate(-50%, -50%)",
        }}
    >
        {text}
    </div>
);

/* ========= MAP ========= */
const PropertyMap = ({ properties }: PropertyMapProps) => {
    const defaultCenter = {
        lat: 21.0285, // Hà Nội
        lng: 105.8542,
    };

    const defaultZoom = 11;

    return (
        <div style={{ height: "92vh", width: "100%" }}>
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: import.meta.env.VITE_GOOGLE_MAP_KEY as string,
                }}
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                yesIWantToUseGoogleMapApiInternals
            >
                {properties.map((p) =>
                    p.latitude && p.longitude ? (
                        <Marker
                            key={p.id}
                            lat={Number(p.latitude)}
                            lng={Number(p.longitude)}
                            text={`${p.currency} ${p.pricePerNight}`}
                        />
                    ) : null
                )}
            </GoogleMapReact>
        </div>
    );
};

export default PropertyMap;
