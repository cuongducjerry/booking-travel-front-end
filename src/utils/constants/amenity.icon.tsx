import {
  faWifi,
  faSnowflake,
  faTv,
  faCar,
  faSwimmingPool,
  faDumbbell,
  faDog,
  faCheck,
  faKitchenSet,
  faHandSparkles,
  faElevator,
  faHotTubPerson,
  faMugSaucer,
  faSmoking,
  faFireExtinguisher,
  faBriefcaseMedical,
  faBed,
  faCouch,
  faShower,
  faToilet,
  faFan,
  faBolt,
  faKey,
  faLock,
  faCamera,
  faPhone,
  faLaptop,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";

export type AmenityIconKey =
  | "WIFI"
  | "AIR_CONDITIONER"
  | "POOL"
  | "PARKING"
  | "KITCHEN"
  | "WASHING_MACHINE"
  | "TV"
  | "HOT_WATER"
  | "ELEVATOR"
  | "BREAKFAST"
  | "GYM"
  | "PET"
  | "SMOKE_DETECTOR"
  | "FIRE_EXTINGUISHER"
  | "FIRST_AID"
  | "BED"
  | "SOFA"
  | "SHOWER"
  | "TOILET"
  | "FAN"
  | "ELECTRICITY"
  | "KEY_ACCESS"
  | "SECURITY_CAMERA"
  | "SAFE"
  | "PHONE"
  | "WORKSPACE"
  | "DINING";

export const AMENITY_ICON_OPTIONS: {
  key: AmenityIconKey;
  label: string;
  icon: any;
}[] = [
  { key: "WIFI", label: "Wifi", icon: faWifi },
  { key: "AIR_CONDITIONER", label: "Air Conditioner", icon: faSnowflake },
  { key: "POOL", label: "Swimming Pool", icon: faSwimmingPool },
  { key: "PARKING", label: "Parking", icon: faCar },
  { key: "KITCHEN", label: "Kitchen", icon: faKitchenSet },
  { key: "WASHING_MACHINE", label: "Washing Machine", icon: faHandSparkles },
  { key: "TV", label: "Television", icon: faTv },
  { key: "HOT_WATER", label: "Hot Water", icon: faHotTubPerson },
  { key: "ELEVATOR", label: "Elevator", icon: faElevator },
  { key: "BREAKFAST", label: "Breakfast", icon: faMugSaucer },
  { key: "GYM", label: "Gym", icon: faDumbbell },
  { key: "PET", label: "Pet Friendly", icon: faDog },
  { key: "SMOKE_DETECTOR", label: "Smoke Detector", icon: faSmoking },
  { key: "FIRE_EXTINGUISHER", label: "Fire Extinguisher", icon: faFireExtinguisher },
  { key: "FIRST_AID", label: "First Aid", icon: faBriefcaseMedical },

  { key: "BED", label: "Bed", icon: faBed },
  { key: "SOFA", label: "Sofa", icon: faCouch },
  { key: "SHOWER", label: "Shower", icon: faShower },
  { key: "TOILET", label: "Toilet", icon: faToilet },
  { key: "FAN", label: "Fan", icon: faFan },
  { key: "ELECTRICITY", label: "Electricity", icon: faBolt },
  { key: "KEY_ACCESS", label: "Key Access", icon: faKey },
  { key: "SECURITY_CAMERA", label: "Security Camera", icon: faCamera },
  { key: "SAFE", label: "Safe", icon: faLock },
  { key: "PHONE", label: "Phone", icon: faPhone },
  { key: "WORKSPACE", label: "Workspace", icon: faLaptop },
  { key: "DINING", label: "Dining Area", icon: faUtensils },
];

export const AMENITY_ICON_MAP = Object.fromEntries(
  AMENITY_ICON_OPTIONS.map(i => [i.key, i.icon])
);

export const DEFAULT_AMENITY_ICON = faCheck;