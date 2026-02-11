import React from "react";
import GoogleMapReact from "google-map-react";
import PropertyMarker from "components/user/map/property.marker";


interface Property {
    id: number;
    latitude: number;
    longitude: number;
    currency: string;
    pricePerNight: number;
}

interface PropertyMapProps {
    properties: Property[];
}

const PropertyMap: React.FC<PropertyMapProps> = ({ properties }) => {
    const defaultCenter = properties.length
        ? {
              lat: properties[0].latitude,
              lng: properties[0].longitude,
          }
        : {
              lat: 16.0544,
              lng: 108.2022,
          };

    return (
        <div className="property-map-container">
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: import.meta.env.VITE_GOOGLE_MAP_KEY as string,
                }}
                defaultCenter={defaultCenter}
                defaultZoom={12}
            >
                {properties.map((p) =>
                    p.latitude && p.longitude ? (
                        <PropertyMarker
                            key={p.id}
                            lat={p.latitude}
                            lng={p.longitude}
                            text={`${p.currency} ${p.pricePerNight}`}
                        />
                    ) : null
                )}
            </GoogleMapReact>
        </div>
    );
};

export default PropertyMap;