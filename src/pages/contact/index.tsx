import { Footer } from "~/components/Footer/Footer";
import { PageHeader } from "~/components/pageHeader/pageHeader";
import { type NextPage } from "next";
import { WorkInProgress } from "~/components/WorkInProgress/WorkInProgress";
import styles from "./index.module.scss";
const Contact: NextPage = () => {
  return (
    <PageHeader secondaryMenu={false}>
      <div className={styles.wrapper}>
        <main>
          <WorkInProgress></WorkInProgress>
        </main>
        <Footer />
      </div>
    </PageHeader>
  );
};

export default Contact;
