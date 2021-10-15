import { useRef, useState } from "react";
import Link from "next/link";
import { Image } from "cloudinary-react";
import ReactMapGL, { Marker, Popup, ViewState } from "react-map-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
import { useLocalState } from "src/utils/useLocalState";
// import { SpotsQuery_spots } from "src/generated/SpotsQuery";
// import { SearchBox } from "./searchBox";

interface IProps {
  setDataBounds: (bounds: string) => void;
}

export default function Map({ setDataBounds }: IProps) {
  const mapRef = useRef<ReactMapGL | null>(null);
  const [viewPort, setViewPort] = useLocalState<ViewState>("viewport", {
    latitude: 40.692241,
    longitude: -73.962587,
    zoom: 12,
  });

  return (
    <div className="text-black relative">
      <ReactMapGL
        {...viewPort}
        width="100%"
        height="calc(100vh - 64px)"
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        onViewportChange={(nextViewport) => setViewPort(nextViewport)}
        ref={(instance) => (mapRef.current = instance)}
        minZoom={5}
        maxZoom={18}
        mapStyle="mapbox://styles/ryan9/ckulvcm7f3tmo17s6txyrq355"
        onLoad={() => {
          if (mapRef.current) {
            const bounds = mapRef.current.getMap().getBounds();

            setDataBounds(JSON.stringify(bounds.toArray()));
          }
        }}
        // only get the bounds of the map when it's not being dragged and rendered
        onInteractionStateChange={(extra) => {
          if (!extra.isDragging && mapRef.current) {
            const bounds = mapRef.current.getMap().getBounds();

            setDataBounds(JSON.stringify(bounds.toArray()));
          }
        }}
      ></ReactMapGL>
    </div>
  );
}
