import { type OSMdata } from "../../utils";
import styles from "../../map.module.scss";

type SearchResultProps = {
  place: OSMdata;
  onClick: (place: OSMdata) => void;
};

export const SearchResult = ({ place, onClick }: SearchResultProps) => {
  const displayLocation: string =
    place.address.city ??
    place.address.town ??
    place.address.village ??
    place.address.hamlet ??
    place.address.locality ??
    place.address.state ??
    "";

  return (
    <li
      onClick={() => {
        onClick(place);
      }}
      className={styles.resultsItem}
    >
      <p>{`${displayLocation}, ${
        place.address.road ? place.address.road : ""
      } ${place.address.house_number ? place.address.house_number : ""} ${
        place.address.country
      } `}</p>
    </li>
  );
};
