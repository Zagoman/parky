import type { NextPage } from "next"
import { PageHeader } from "../../components/pageHeader/pageHeader"

import styles from "./map.module.scss"
import dynamic from "next/dynamic"
import { InputField } from "~/components/FormElements/InputField/InputField"
import { useEffect, useState } from "react"
import type { OSMdata } from "./utils"
import { SearchResult } from "./components/SearchResult/SearchResult"
import { useForm } from "react-hook-form"

type QueryParameters = {
  q: string
  format: string
  addressdetails: string
  polygon_geojson: string
}

const MapComponent = dynamic(
  () => import("./components/mapComponent/mapComponent"),
  {
    ssr: false,
  }
)

const NominatimUrl = "https://nominatim.openstreetmap.org/search?"

const Map: NextPage = () => {
  const { register, watch } = useForm<{ parkingQuery: string }>({
    defaultValues: { parkingQuery: "" },
  })
  const { parkingQuery } = watch()
  const [queryResults, setQueryResults] = useState<OSMdata[]>([])
  const [selectPosition, setSelectPosition] = useState<OSMdata>()
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const mapHandler = (
    <div
      className={styles.secondaryMenuWrapper}
      onFocus={() => parkingQuery.length > 0 && setIsDropdownVisible(true)}
    >
      <div className={styles.inputWrapper}>
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
                  console.log(place)
                  setSelectPosition(place)
                  // setIsDropdownVisible(false)
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
  )
  useEffect(() => {
    setQueryResults([])
    setIsSearching(true)
    const delayDebounceFn = setTimeout(() => {
      console.log("debouncing")
      const queryParameters: QueryParameters = {
        q: parkingQuery,
        format: "json",
        addressdetails: "1",
        polygon_geojson: "0",
      }
      const queryString = new URLSearchParams(queryParameters).toString()

      fetch(`${NominatimUrl}${queryString}`)
        .then((response) => response.text())
        .then((result: string) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const results: [OSMdata] = JSON.parse(result)
          const filteredResults = results.filter(
            (place) =>
              place.class === "boundary" ||
              place.class === "place" ||
              place.class === "highway"
          )
          console.log(filteredResults)
          setIsSearching(false)
          setQueryResults(filteredResults)
          setIsDropdownVisible(true)
        })
        .catch((err) => console.log("error:", err))
    }, 500)
    return () => clearTimeout(delayDebounceFn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parkingQuery])
  return (
    <>
      <PageHeader secondaryMenu={true} secondaryMenuContents={mapHandler}>
        <div className={styles.mapWrapper}>
          <MapComponent location={selectPosition} />
        </div>
      </PageHeader>
    </>
  )
}

export default Map
