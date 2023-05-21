/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { NextPage } from "next";
import { PageHeader } from "../../components/pageHeader/pageHeader";
import styles from "./map.module.scss";
import dynamic from "next/dynamic";
import { InputField } from "~/components/FormElements/InputField/InputField";
import { useEffect, useState } from "react";
import { type OSMdata } from "../../components/MapComponent/utils";
import { SearchResult } from "../../components/MapComponent/SearchResult";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { type ParkingSpot } from "../../components/MapComponent/utils";
import { ParkingSpotCard } from "~/components/ParkingSpotCard/ParkingSpotCard";

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
  const { register, watch } = useForm<{ parkingQuery: string }>({
    defaultValues: { parkingQuery: "" },
  });

  const { parkingQuery } = watch();
  const [queryResults, setQueryResults] = useState<OSMdata[]>([]);
  const [selectPosition, setSelectPosition] = useState<OSMdata>();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [nearbyParkingSpots, setNearbyParkingSpots] = useState<
    ParkingSpot[] | []
  >([]);

  type QueryVariables = {
    current: {
      latitude: number;
      longitude: number;
    };
    range: number;
  };

  const [variables, setVariables] = useState<QueryVariables>({
    current: { latitude: 1, longitude: 1 },
    range: 15,
  });

  const { data, isLoading } =
    api.parking.getParkingWithinRange.useQuery(variables);

  useEffect(() => {
    if (data?.length) {
      const fetchedData = data as ParkingSpot[];
      setNearbyParkingSpots(fetchedData);
    } else {
      setNearbyParkingSpots([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const mapHandler = () => {
    return (
      <div className={styles.secondaryMenu}>
        {/* daily/monthly selector */}
        <div></div>
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
              label="Search parking spots"
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
                      styles.dropdownHidden && styles.dropdownHidden
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
        <div></div>
        {/* search results wrapper */}
        <div className={styles.spotList}>
          <div className={styles.spotListControls}>
            <div>Duration:</div>
            <div className={styles.spotListControlsButtons}>
              <p>Sort</p>
              <p>Filter</p>
            </div>
          </div>
          <div className={styles.spotListWrapper}>
            {nearbyParkingSpots.length === 0 && parkingQuery.length ? (
              <div className={styles.spotListWrapperEmptyState}>
                No parking spots within 1km found. Please change location.
              </div>
            ) : isLoading ? (
              <div className={styles.spotListWrapperLoader}>
                <div className={styles.skeletonElement}></div>
                <div className={styles.skeletonElement}></div>
                <div className={styles.skeletonElement}></div>
                <div className={styles.skeletonElement}></div>
              </div>
            ) : nearbyParkingSpots.length > 0 && !isLoading ? (
              <div className={styles.spotListWrapperItems}>
                {nearbyParkingSpots.map((spot) => (
                  <ParkingSpotCard spot={spot} key={spot.id} />
                ))}
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
