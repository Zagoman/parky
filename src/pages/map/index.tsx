import { type NextPage } from "next";
import { PageHeader } from "../../components/pageHeader/pageHeader";

import styles from "./map.module.scss";
import dynamic from "next/dynamic";
import { InputField } from "~/components/FormElements/InputField/InputField";
import { useEffect, useState } from "react";
import { Button } from "~/components/button/button";
import { type OSMdata } from "./utils";
import { type InputInfo } from "~/components/CreateProfile/CreateProfile";
import { SearchResult } from "./components/SearchResult/SearchResult";
import useDebounce from "~/utils/debouncer";

type QueryParameters = {
  q: string;
  format: string;
  addressdetails: string;
  polygon_geojson: string;
};

const MapComponent = dynamic(
  () => import("./components/mapComponent/mapComponent"),
  {
    ssr: false,
  }
);

const NominatimUrl = "https://nominatim.openstreetmap.org/search?";

const Map: NextPage = () => {
  const [parkingQuery, setParkingQuery] = useState<InputInfo<string>>({
    value: "",
  });
  const [queryResults, setQueryResults] = useState<OSMdata[]>([]);
  const [selectPosition, setSelectPosition] = useState<OSMdata>();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const debouncedQueryValue = useDebounce(parkingQuery, 500);
  const [isSearching, setIsSearching] = useState(false);
  const mapHandler = (
    <div
      onBlur={() => setIsDropdownVisible(false)}
      className={styles.secondaryMenuWrapper}
    >
      <div
        className={styles.inputWrapper}
        onFocus={() => setIsDropdownVisible(true)}
        onBlur={() => setIsDropdownVisible(false)}
      >
        <InputField
          inputType="text"
          label="Search parking spots"
          name="parkingQuery"
          placeholder="Street address"
          value={parkingQuery.value}
          onChange={setParkingQuery}
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
          {queryResults.length > 0 && parkingQuery ? (
            queryResults.map((place) => (
              <SearchResult
                key={place.osm_id}
                place={place}
                onClick={() => {
                  setSelectPosition(place);
                  setIsDropdownVisible(false);
                }}
              />
            ))
          ) : isSearching ? (
            <li className={styles.spinner}>
              Searching... <span></span>
            </li>
          ) : (
            <li className={styles.emptyState}>No places found</li>
          )}
        </ul>
      </div>
      <Button
        text="Search"
        type="primary"
        onClick={() => {
          console.log("button_clicked");
        }}
      />
    </div>
  );

  useEffect(() => {
    setIsSearching(true);
    if (debouncedQueryValue) {
      const queryParameters: QueryParameters = {
        q: parkingQuery.value,
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
          {
            console.log(results);
          }
          setQueryResults(filteredResults);
          setIsDropdownVisible(true);
          setIsSearching(false);
        })
        .catch((err) => console.log("error:", err));
    } else {
      setQueryResults([]);
      setIsSearching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parkingQuery]);

  return (
    <>
      <PageHeader secondaryMenu={true} secondaryMenuContents={mapHandler}>
        <div className={styles.mapWrapper}>
          <MapComponent location={selectPosition} />
        </div>
      </PageHeader>
    </>
  );
};

export default Map;
