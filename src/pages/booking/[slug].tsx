import { type NextPage } from "next";
import { useRouter } from "next/router";
import { DashboardWrapper } from "~/components/DashboardWrapper/DashboardWrapper";
import { api } from "~/utils/api";

const Booking: NextPage = () => {
  const router = useRouter();
  const id = router.query.slug;

  return (
    <div>
      <DashboardWrapper active={"bookings"}>
        <div> TEST</div>
      </DashboardWrapper>
    </div>
  );
};

export default Booking;
