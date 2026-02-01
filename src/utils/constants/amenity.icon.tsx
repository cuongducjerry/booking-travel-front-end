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
  faBriefcaseMedical
} from "@fortawesome/free-solid-svg-icons";

export const AMENITY_ICON_MAP: Record<string, any> = {
  WIFI: faWifi,
  AIR_CONDITIONER: faSnowflake,
  POOL: faSwimmingPool,
  PARKING: faCar,
  KITCHEN: faKitchenSet,
  WASHING_MACHINE: faHandSparkles,
  TV: faTv,
  HOT_WATER: faHotTubPerson,
  ELEVATOR: faElevator,
  BREAKFAST: faMugSaucer,
  GYM: faDumbbell,
  PET: faDog,
  SMOKE_DETECTOR: faSmoking,
  FIRE_EXTINGUISHER: faFireExtinguisher,
  FIRST_AID: faBriefcaseMedical
};

// fallback icon
export const DEFAULT_AMENITY_ICON = faCheck;
