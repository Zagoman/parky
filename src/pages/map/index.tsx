import { type NextPage } from "next";
import { PageHeader } from "../../components/pageHeader/pageHeader";
import { DashboardWrapper } from "~/components/dashboardWrapper/dashboardWrapper";
import { UiBox } from "../../components/uiBox/uiBox";
import { Button } from "~/components/button/button";
const Map: NextPage = () => {
  return (
    <>
      {/* <DashboardWrapper active="myparkingspots">
        <div>
          <UiBox>
            <Button
              onClick={() => console.log("test")}
              type="primary"
              text="Primary button"
            />
            <Button
              onClick={() => console.log("test")}
              type="secondary"
              text="Secondary button"
            />
          </UiBox>
          <UiBox>
            <Button
              onClick={() => console.log("test")}
              type="primary"
              text="Primary button"
            />
            <Button
              onClick={() => console.log("test")}
              type="secondary"
              text="Secondary button"
            />
          </UiBox>
        </div>
      </DashboardWrapper> */}
      <PageHeader secondaryMenu={true}>
        <UiBox>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat
            obcaecati cumque odit saepe molestias laborum a maiores architecto
            vitae recusandae?
          </p>
        </UiBox>
      </PageHeader>
    </>
  );
};

export default Map;
