/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import styles from "./SpotFeatures.module.scss";

import chargingIcon from "../../../../public/icon/charging.svg";
import garageIcon from "../../../../public/icon/garage.svg";
import roofIcon from "../../../../public/icon/roof.svg";
import cctvIcon from "../../../../public/icon/cctv.svg";
import gateIcon from "../../../../public/icon/gate.svg";
import instantIcon from "../../../../public/icon/instant.svg";
import fulldayIcon from "../../../../public/icon/247.svg";
import lightsIcon from "../../../../public/icon/light.svg";
import featureIcon from "../../../../public/icon/feature.svg";
import { FeatureWrapper } from "./components/FeatureWrapper";

type SpotFeaturesProps = {
  features: string[];
};

export const SpotFeatures = ({ features }: SpotFeaturesProps): JSX.Element => {
  function iconHandler(feature: string) {
    let result;
    switch (feature) {
      default:
        result = featureIcon;
        break;
      case "charging":
        result = chargingIcon;
        break;
      case "garage":
        result = garageIcon;
        break;
      case "roof":
        result = roofIcon;
        break;
      case "camera":
        result = cctvIcon;
        break;
      case "cctv":
        result = cctvIcon;
        break;
      case "gate":
        result = gateIcon;
        break;
      case "24/7":
        result = fulldayIcon;
        break;
      case "instant":
        result = instantIcon;
        break;
      case "lights":
        result = lightsIcon;
        break;
    }
    return result;
  }

  function descriptionHandler(feature: string) {
    let result;
    switch (feature) {
      default:
        result = feature;
        break;
      case "charging":
        result = "Charging station";
        break;
      case "garage":
        result = "Garage";
        break;
      case "roof":
        result = "Roofed";
        break;
      case "camera":
        result = "CCTV";
        break;
      case "cctv":
        result = "CCTV";
        break;
      case "gate":
        result = "Security gate";
        break;
      case "24/7":
        result = "24/7 access";
        break;
      case "instant":
        result = "Instant booking";
        break;
      case "lights":
        result = "Lights";
        break;
    }
    return result;
  }

  return (
    <div className={styles.featureWrapper}>
      {features &&
        features.map((feature, index) => {
          return (
            <FeatureWrapper
              src={iconHandler(feature)}
              key={index}
              feature={descriptionHandler(feature)}
            />
          );
        })}
    </div>
  );
};
