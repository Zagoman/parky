/* eslint-disable @typescript-eslint/restrict-template-expressions */
import styles from "./FeatureWrapper.module.scss";
import Image from "next/image";
import { useState } from "react";

type FeatureWrapperProps = {
  feature: string;
  src: "string";
};

export const FeatureWrapper = ({ feature, src }: FeatureWrapperProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <article
      onClick={() => {
        isTooltipVisible
          ? setIsTooltipVisible(false)
          : setIsTooltipVisible(true);
      }}
      onBlur={() => {
        setIsTooltipVisible(false);
      }}
      className={styles.feature}
    >
      <span
        className={
          isTooltipVisible
            ? `${styles.featureTooltip} ${styles.featureTooltipVisible}`
            : styles.featureTooltip
        }
      >
        {feature}
      </span>
      <Image src={src} alt={feature} className={styles.featureImage} />
    </article>
  );
};
