import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import styles from "./mapComponent.module.scss";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMap } from "react-leaflet";

import { Circle } from "react-leaflet";
import { type OSMdata } from "../../utils";

const pinIcon = L.icon({
  iconSize: [36, 36],
  iconUrl: "./icon/map-pin-blue.svg",
});

type MapProps = {
  location?: OSMdata;
};

type ResetViewProps = {
  selectPosition: OSMdata | undefined;
};

const MapComponent = ({ location }: MapProps) => {
  function ResetView({ selectPosition }: ResetViewProps) {
    const map = useMap();

    useEffect(() => {
      if (selectPosition) {
        map.setView(
          L.latLng(selectPosition?.lat, selectPosition?.lon),
          map.getZoom(),
          {
            animate: true,
          }
        );
      }
    }, [selectPosition]);
    return null;
  }

  const fillBlueOptions = { fillColor: "blue" };

  return (
    <MapContainer
      center={[55.6, 12.5]}
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
          <Marker position={[location.lat, location.lon]} icon={pinIcon}>
            <Popup>
              <p>{location.display_name}</p>
            </Popup>
          </Marker>

          <Circle
            center={[location.lat, location.lon]}
            pathOptions={fillBlueOptions}
            radius={500}
          />
        </>
      ) : (
        ""
      )}
      <ResetView selectPosition={location} />
    </MapContainer>
  );
};

export default MapComponent;
