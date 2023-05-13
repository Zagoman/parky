import { type NextPage } from "next";
import { PageHeader } from "../../components/pageHeader/pageHeader";
import { DashboardWrapper } from "~/components/dashboardWrapper/dashboardWrapper";
import { UiBox } from "../../components/uiBox/uiBox";
import { Button } from "~/components/button/button";
const Map: NextPage = () => {
  return (
    <>
      <DashboardWrapper>
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
      </DashboardWrapper>
    </>
  );
};

export default Map;
