import { type OSMdata } from "../../pages/map/utils";
import styles from "./SearchResult.module.scss";

type SearchResultProps = {
  place: OSMdata;
  onClick: (place: OSMdata) => void;
};

export const SearchResult = ({ place, onClick }: SearchResultProps) => {
  let displayRoad: string | undefined;
  const displayLocation: string | undefined =
    place.address.city ??
    place.address.town ??
    place.address.village ??
    place.address.hamlet ??
    place.address.locality ??
    place.address.state ??
    place.address.isolated_dwelling ??
    place.address.suburb ??
    undefined;

  if (place.address.road && place.address.house_number) {
    displayRoad = `${place.address.road} ${place.address.house_number}`;
  } else if (place.address.road && !place.address.house_number) {
    displayRoad = place.address.road;
  } else {
    displayRoad = undefined;
  }

  return (
    <li
      onClick={() => {
        onClick(place);
      }}
      className={styles.resultsItem}
    >
      <p>
        {displayLocation ? `${displayLocation}, ` : ""}
        {displayRoad ? `${displayRoad}, ` : ""}
        {place.address.country}
      </p>
    </li>
  );
};
