import { Card } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AMENITY_ICON_OPTIONS, type AmenityIconKey } from "@/utils/constants/amenity.icon";


interface IconPickerProps {
    value?: AmenityIconKey;
    onChange?: (v: AmenityIconKey) => void;
    disabledIcons?: AmenityIconKey[];
}

const AmenityIconPicker = ({
    value,
    onChange,
    disabledIcons = [],
}: IconPickerProps) => {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                gap: 12,
            }}
        >
            {AMENITY_ICON_OPTIONS.map((item) => {
                const isDisabled = disabledIcons.includes(item.key);
                const isSelected = value === item.key;

                return (
                    <Card
                        key={item.key}
                        hoverable={!isDisabled}
                        onClick={() => {
                            if (!isDisabled) {
                                onChange?.(item.key);
                            }
                        }}
                        style={{
                            textAlign: "center",
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            opacity: isDisabled ? 0.35 : 1,
                            borderColor: isSelected ? "#1677ff" : undefined,
                        }}
                        bodyStyle={{ padding: 12 }}
                    >
                        <FontAwesomeIcon
                            icon={item.icon}
                            fontSize={22}
                        />
                        <div
                            style={{
                                fontSize: 12,
                                marginTop: 6,
                            }}
                        >
                            {item.label}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default AmenityIconPicker;