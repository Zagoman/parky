import { type NextPage } from "next";
import { PageHeader } from "../../components/pageHeader/pageHeader";

import styles from "./map.module.scss";
import dynamic from "next/dynamic";
import { InputField } from "~/components/InputField/InputField";
import { useState } from "react";
import { Button } from "~/components/button/button";
import { type OSMdata } from "./utils";
import { JSONObject } from "superjson/dist/types";

type QueryParameters = {
  q: string;
  format: string;
  addressdetails: string;
  polygon_geojson: string;
};

const MapImport = dynamic(() => import("./components/mapComponent"), {
  ssr: false,
});

const NominatimUrl = "https://nominatim.openstreetmap.org/search?";

const Map: NextPage = () => {
  const [parkingQuery, setParkingQuery] = useState("");
  const [queryResults, setQueryResults] = useState<OSMdata[]>([]);
  const [selectPosition, setSelectPosition] = useState<OSMdata>();

  const mapHandler = (
    <div>
      <InputField
        inputType="text"
        label="Search parking spots"
        name="parkingQuery"
        placeholder="street address"
        value={parkingQuery}
        onChange={(event) => setParkingQuery(event.target.value)}
      />
      <Button
        text="Search"
        type="primary"
        onClick={() => {
          const queryParameters: QueryParameters = {
            q: parkingQuery,
            format: "json",
            addressdetails: "1",
            polygon_geojson: "0",
          };
          const queryString = new URLSearchParams(queryParameters).toString();
          fetch(`${NominatimUrl}${queryString}`)
            .then((response) => response.text())
            .then((result: any) => {
              const results: [OSMdata] = JSON.parse(result);
              setQueryResults(results);
            })
            .catch((err) => console.log("error:", err));
        }}
      />
      <ul>
        {queryResults.map((place) => (
          <li
            key={place.osm_id}
            onClick={() => {
              setSelectPosition(place);
            }}
          >
            {place.display_name}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <PageHeader secondaryMenu={true} secondaryMenuContents={mapHandler}>
        <div className={styles.mapWrapper}>
          <MapImport location={selectPosition} />
        </div>
      </PageHeader>
    </>
  );
};

export default Map;
