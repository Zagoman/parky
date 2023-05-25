import { type NextPage } from "next";
import { DashboardWrapper } from "~/components/dashboardWrapper/dashboardWrapper";

import styles from "./index.module.scss";
import { UiBox } from "~/components/uiBox/uiBox";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  return (
    <DashboardWrapper active="dashboard">
      <section className={styles.gridWrapper}>
        <UiBox>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae
          nulla sit esse itaque rem facere tenetur veniam et praesentium amet?
        </UiBox>
        <UiBox className={styles.large}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. In
          praesentium, explicabo, ipsam incidunt maiores est repellat dolor
          delectus vero magnam officia quae facilis suscipit similique minima
          porro sit ratione sapiente at laudantium. Quisquam quasi explicabo
          quis. Aliquam nihil sapiente velit dignissimos atque provident,
          temporibus, inventore in eligendi dolorum, incidunt ad tempora
          consequuntur repellat? Cumque quos, facere eligendi quia labore
          perspiciatis. Similique, culpa adipisci quo voluptas blanditiis
          explicabo labore ea quod accusantium animi porro quia tenetur rem
          rerum dignissimos, sequi excepturi! Distinctio ratione voluptatem
          dolorum beatae eligendi nam, accusantium maxime dolores veniam ipsum,
          quas, sed alias eveniet quaerat doloribus aliquid expedita?
        </UiBox>
        <UiBox className={styles.order}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae
          nulla sit esse itaque rem facere tenetur veniam et praesentium amet?
        </UiBox>
      </section>
    </DashboardWrapper>
  );
};

export default Home;
