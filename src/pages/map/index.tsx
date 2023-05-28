/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "./map.module.scss";
import dynamic from "next/dynamic";
import { PageHeader } from "../../components/pageHeader/pageHeader";
import { InputField } from "~/components/FormElements/InputField/InputField";
import { type OSMdata } from "../../components/MapComponent/utils";
import { SearchResult } from "../../components/MapComponent/SearchResult";
import { type ParkingSpot } from "../../components/MapComponent/utils";
import { ParkingSpotCard } from "~/components/ParkingSpotCard/ParkingSpotCard";
import { useForm } from "react-hook-form";
import { type RouterOutputs, api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { BookingForm } from "~/components/BookingForm/components/BookingForm/BookingForm";
import { PurchaseModal } from "~/components/BookingForm/components/PurchaseModal/PurchaseModal";
import { Button } from "~/components/button/button";
import { Toggle } from "~/components/Toggle/Toggle";

type QueryParameters = {
  q: string;
  format: string;
  addressdetails: string;
  polygon_geojson: string;
};

const MapComponent = dynamic(
  () => import("../../components/MapComponent/MapComponent"),
  {
    ssr: false,
  }
);

const NominatimUrl = "https://nominatim.openstreetmap.org/search?";

const Map: NextPage = () => {
  const [queryResults, setQueryResults] = useState<OSMdata[]>([]);
  const [selectPosition, setSelectPosition] = useState<OSMdata>();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [nearbyParkingSpots, setNearbyParkingSpots] = useState<
    RouterOutputs["parking"]["getParkingWithinRange"]
  >([]);
  const [purchaseFormContents, setPurchaseFormContents] =
    useState<JSX.Element>();
  const [isPurchaseFormVisible, setIsPurchaseFormVisible] = useState(false);
  const [bookingType, setBookingType] = useState("hourly");
  const [userId, setUserId] = useState("");
  const user = useUser();
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

  const { register, watch } = useForm<{ parkingQuery: string }>({
    defaultValues: { parkingQuery: "" },
  });

  const {
    register: registerBookingDate,
    watch: watchBookingDate,
    getValues,
  } = useForm<{
    bookingDate: string;
  }>({
    defaultValues: { bookingDate: today.toISOString().slice(0, 16) },
  });

  const { parkingQuery } = watch();

  const [variables, setVariables] = useState<QueryVariables>({
    current: { latitude: 1, longitude: 1 },
    range: 15,
  });

  const { data, isLoading } =
    api.parking.getParkingWithinRange.useQuery(variables);

  const {
    data: userData,
    isLoading: isUserLoading,
    refetch,
  } = api.profile.getProfileById.useQuery({
    id: userId,
  });

  type QueryVariables = {
    current: {
      latitude: number;
      longitude: number;
    };
    range: number;
  };

  useEffect(() => {
    if (data?.length) {
      const fetchedData = data;
      setNearbyParkingSpots(fetchedData);
    } else {
      setNearbyParkingSpots([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (user.user && user.isSignedIn && !isUserLoading) {
      setUserId(user?.user?.id);
      void refetch();
    }
  }, [user.user, isUserLoading]);

  const findSpot = (spotId: string) => {
    const spot = nearbyParkingSpots.filter((spot) => spot.id === spotId);
    return spot;
  };

  const spotSelectionHandler = (spotId: string) => {
    setIsPurchaseFormVisible(true);

    if (!user.isSignedIn) {
      setPurchaseFormContents(
        <BookingForm
          spot={findSpot(spotId)}
          isUserSignedIn={user.isSignedIn}
          onCancel={() => setIsPurchaseFormVisible(false)}
          bookingType={bookingType}
          bookingDate={getValues("bookingDate")}
        />
      );
    } else if (user.isSignedIn && findSpot.length && userData) {
      setPurchaseFormContents(
        <BookingForm
          isUserSignedIn={user.isSignedIn}
          onCancel={() => setIsPurchaseFormVisible(false)}
          userId={user.user.id}
          spot={findSpot(spotId)}
          userBalance={userData?.balance}
          bookingType={bookingType}
          bookingDate={getValues("bookingDate")}
        />
      );
      // show parking booking form
    } else {
      setPurchaseFormContents(
        <>
          <div>Something went wrong</div>
          <Button
            type="primary"
            text="close"
            onClick={() => setIsPurchaseFormVisible(false)}
          />
        </>
      );
    }
  };

  const mapHandler = () => {
    return (
      <div className={styles.secondaryMenu}>
        {/* daily/monthly selector */}
        <div className={styles.bookingType}>
          <Toggle
            names={["Daily/Hourly", "Monthly"]}
            values={["hourly", "monthly"]}
            activeValue={bookingType}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            onClick={(type) => setBookingType(type)}
          />
        </div>
        {/* address input */}
        <div
          className={styles.secondaryMenuWrapper}
          onFocus={() =>
            parkingQuery.length > 0
              ? setIsDropdownVisible(true)
              : setIsDropdownVisible(false)
          }
        >
          <div
            className={styles.inputWrapper}
            onBlur={() => setIsDropdownVisible(false)}
          >
            <InputField
              name="parkingQuery"
              inputType="text"
              label="Address"
              placeholder="Street address"
              register={register}
            />
            <ul
              className={
                isDropdownVisible
                  ? styles.resultsWrapper
                  : // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    `${styles.resultsWrapper} ${
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      styles.dropdownHidden
                    }`
              }
            >
              {queryResults.length > 0 && parkingQuery.length > 0 ? (
                queryResults.map((place) => (
                  <SearchResult
                    key={place.osm_id}
                    place={place}
                    onClick={() => {
                      setSelectPosition(place);
                      setVariables({
                        current: {
                          latitude: parseFloat(place.lat),
                          longitude: parseFloat(place.lon),
                        },
                        range: 1000,
                      });
                      // setIsDropdownVisible(false);
                    }}
                  />
                ))
              ) : isSearching && parkingQuery.length > 0 ? (
                <li className={styles.spinner}>
                  Searching... <span></span>
                </li>
              ) : parkingQuery.length == 0 ? (
                <li className={styles.emptyState}>Please type your query</li>
              ) : (
                <li className={styles.emptyState}>No places found</li>
              )}
            </ul>
          </div>
        </div>
        {/*date selector*/}
        <div className={styles.dateSelector}>
          <InputField
            inputType="datetime-local"
            label="Book from"
            name="bookingDate"
            placeholder={today.toISOString().slice(0, 16)}
            register={registerBookingDate}
            min={today.toISOString().slice(0, 16)}
          />
        </div>
        {/* search results wrapper */}
        <div className={styles.spotList}>
          <div className={styles.spotListControls}>
            <div>Booking type: {bookingType}</div>
            <div className={styles.spotListControlsButtons}>
              <p>Sort</p>
              <p>Filter</p>
            </div>
          </div>
          <div className={styles.spotListWrapper}>
            {nearbyParkingSpots.length === 0 &&
            parkingQuery.length &&
            !isSearching ? (
              <div className={styles.spotListWrapperEmptyState}>
                No parking spots within 1km found. Please change location.
              </div>
            ) : isLoading ? (
              <div className={styles.spotListWrapperLoader}>
                <div className={styles.skeletonElement}></div>
                <div className={styles.skeletonElement}></div>
              </div>
            ) : nearbyParkingSpots.length > 0 && !isLoading ? (
              <div className={styles.spotListWrapperItems}>
                {nearbyParkingSpots.map((spot) => (
                  <ParkingSpotCard
                    spot={spot}
                    key={spot.id}
                    onClick={(spotId) => {
                      spotSelectionHandler(spotId);
                    }}
                  />
                ))}
              </div>
            ) : isSearching ? (
              <div className={styles.spotListWrapperLoader}>
                <div className={styles.skeletonElement}></div>
                <div className={styles.skeletonElement}></div>
              </div>
            ) : (
              <div className={styles.spotListWrapperEmptyState}>
                Please enter a street address.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setQueryResults([]);
    setIsSearching(true);
    const delayDebounceFn = setTimeout(() => {
      const queryParameters: QueryParameters = {
        q: parkingQuery,
        format: "json",
        addressdetails: "1",
        polygon_geojson: "0",
      };
      const queryString = new URLSearchParams(queryParameters).toString();

      fetch(`${NominatimUrl}${queryString}`)
        .then((response) => response.text())
        .then((result: string) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const results: [OSMdata] = JSON.parse(result);
          const filteredResults = results.filter(
            (place) =>
              place.class === "boundary" ||
              place.class === "place" ||
              place.class === "highway"
          );
          setIsSearching(false);
          setQueryResults(filteredResults);
          parkingQuery.length && setIsDropdownVisible(true);
        })
        .catch((err) => console.log("error:", err));
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parkingQuery]);

  return (
    <>
      <PageHeader secondaryMenu={true} secondaryMenuContents={mapHandler}>
        <div className={styles.mapWrapper}>
          {purchaseFormContents && (
            <PurchaseModal
              onCancel={() => setIsPurchaseFormVisible(false)}
              isVisible={isPurchaseFormVisible}
            >
              {purchaseFormContents}
            </PurchaseModal>
          )}
          <MapComponent
            location={selectPosition}
            nearbyParkingSpots={nearbyParkingSpots}
          />
        </div>
      </PageHeader>
    </>
  );
};

export default Map;
