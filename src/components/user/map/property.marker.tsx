import React from "react";

export interface PropertyMarkerProps {
    lat: number;
    lng: number;
    text: string;
}

const PropertyMarker: React.FC<PropertyMarkerProps> = ({ text }) => {
    return <div className="map-marker">{text}</div>;
};

export default PropertyMarker;