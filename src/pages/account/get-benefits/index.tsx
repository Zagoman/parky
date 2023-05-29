import { type NextPage } from "next";
import { DashboardFooter } from "~/components/DashboardElements/components/DashboardFooter/DashboardFooter";
import { DashboardWrapper } from "~/components/DashboardWrapper/DashboardWrapper";
import Link from "next/link";
import styles from "./index.module.scss";
import { WorkInProgress } from "~/components/WorkInProgress/WorkInProgress";

const GetBenefits: NextPage = () => {
  return (
    <DashboardWrapper active="get-benefits">
      <div className={styles.contentWrapper}>
        <WorkInProgress />
        <DashboardFooter>
          <ul>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/help">Help</Link>
            </li>
          </ul>
        </DashboardFooter>
      </div>
    </DashboardWrapper>
  );
};

export default GetBenefits;
