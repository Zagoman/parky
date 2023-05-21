import React, { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMap, Circle } from "react-leaflet";
import { type OSMdata } from "./utils";
import { type ParkingSpot } from "./utils";

const pinIcon = L.icon({
  iconSize: [36, 36],
  iconUrl: "./icon/map-pin-blue.svg",
});

type MapProps = {
  location?: OSMdata;
  nearbyParkingSpots: ParkingSpot[] | [];
};

type ResetViewProps = {
  selectPosition: OSMdata | undefined;
};

const MapComponent = ({ location, nearbyParkingSpots }: MapProps) => {
  function ResetView({ selectPosition }: ResetViewProps) {
    const map = useMap();

    useEffect(() => {
      if (selectPosition) {
        map.setView(
          L.latLng(
            parseFloat(selectPosition?.lat),
            parseFloat(selectPosition?.lon)
          ),
          map.getZoom(),
          {
            animate: true,
          }
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectPosition]);
    return null;
  }

  const fillBlueOptions = {
    fillColor: "#1b31a4",
    dashArray: "10, 10",
    dashOffset: "10",
    fillOpacity: 0.2,
  };

  return (
    <MapContainer
      center={[55.6867243, 12.5700724]}
      zoom={13}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=pSdO0p7aotEmiB0g4S3q"
        tileSize={512}
        zoomOffset={-1}
      />
      {location?.lat && location?.lon ? (
        <>
          {/* <Marker
            position={[parseFloat(location.lat), parseFloat(location.lon)]}
            icon={pinIcon}
          >
            <Popup>
              <p>{location.display_name}</p>
              <p>
                {location.lon} {location.lat}
              </p>
            </Popup>
          </Marker> */}

          <Circle
            center={[parseFloat(location.lat), parseFloat(location.lon)]}
            pathOptions={fillBlueOptions}
            radius={500}
          />

          {nearbyParkingSpots.length &&
            nearbyParkingSpots.map((spot) => {
              if (spot)
                return (
                  <Marker
                    position={[spot?.latitude, spot?.longitude]}
                    icon={pinIcon}
                    key={spot.id}
                  >
                    <Popup>
                      <p>{spot.address}</p>
                      <p>{spot.price}</p>
                    </Popup>
                  </Marker>
                );
            })}
        </>
      ) : (
        ""
      )}
      <ResetView selectPosition={location} />
    </MapContainer>
  );
};

export default MapComponent;
