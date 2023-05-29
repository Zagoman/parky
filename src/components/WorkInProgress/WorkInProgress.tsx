import { UiBox } from "../uiBox/uiBox";
import styles from "./WorkInProgress.module.scss";
export const WorkInProgress = () => {
  return (
    <UiBox className={styles.wrapper}>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          fill="#28333e"
          viewBox="0 0 16 16"
        >
          <path d="M9.97 4.88l.953 3.811C10.158 8.878 9.14 9 8 9c-1.14 0-2.159-.122-2.923-.309L6.03 4.88C6.635 4.957 7.3 5 8 5s1.365-.043 1.97-.12zm-.245-.978L8.97.88C8.718-.13 7.282-.13 7.03.88L6.274 3.9C6.8 3.965 7.382 4 8 4c.618 0 1.2-.036 1.725-.098zm4.396 8.613a.5.5 0 0 1 .037.96l-6 2a.5.5 0 0 1-.316 0l-6-2a.5.5 0 0 1 .037-.96l2.391-.598.565-2.257c.862.212 1.964.339 3.165.339s2.303-.127 3.165-.339l.565 2.257 2.391.598z" />
        </svg>
      </div>
      <div>
        <h4>Work in progress</h4>
        <p>Unfortunately contents of this page are currently unavailable.</p>
      </div>
    </UiBox>
  );
};