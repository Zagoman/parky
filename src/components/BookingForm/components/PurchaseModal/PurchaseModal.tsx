/* eslint-disable @typescript-eslint/restrict-template-expressions */
import styles from "./PurchaseModal.module.scss";

type PurchaseModalProps = {
  children: JSX.Element;
  onCancel: () => void;
  isVisible: boolean;
};

export const PurchaseModal = ({
  children,
  onCancel,
  isVisible,
}: PurchaseModalProps) => {
  return (
    <div
      className={
        isVisible
          ? styles.screenWrapper
          : `${styles.screenWrapper} ${styles.hidden}`
      }
    >
      <div className={styles.formWrapper}>
        <span onClick={onCancel} className={styles.close}>
          {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              fill="#566777"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          }
        </span>
        {children}
      </div>
    </div>
  );
};
