import { useRef, useState } from "react";
import Link from "next/link";
import { Image } from "cloudinary-react";
import ReactMapGL, { Marker, Popup, ViewState } from "react-map-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
import { useLocalState } from "src/utils/useLocalState";
import { SpotsQuery_spots } from "src/generated/SpotsQuery";
// import { SearchBox } from "./searchBox";

interface IProps {
  setDataBounds: (bounds: string) => void;
  spots: SpotsQuery_spots[];
}

export default function Map({ setDataBounds, spots }: IProps) {
  const [selected, setSelected] = useState<SpotsQuery_spots | null>(null);
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
      >
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            latitude={spot.latitude}
            longitude={spot.longitude}
            offsetLeft={-15}
            offsetTop={-15}
          >
            <button
              style={{ width: "30px", height: "30px", fontSize: "30px" }}
              type="button"
              onClick={() => setSelected(spot)}
            >
              <img src="/gge-solid.png" alt="spot" className="w-8" />
            </button>
          </Marker>
        ))}

        {selected && (
          <Popup
            latitude={selected.latitude}
            longitude={selected.longitude}
            onClose={() => setSelected(null)}
            closeOnClick={false}
          >
            <div className="text-center">
              <h3 className="px-4">{selected.address.substr(0, 30)}</h3>
              <Image
                className="mx-auto my-4"
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={selected.publicId}
                secure
                dpr="auto"
                quality="auto"
                width={200}
                height={Math.floor((9 / 16) * 200)}
                crop="fill"
                gravity="auto"
              />
              <Link href={`/spots/${selected.id}`}>
                <a>View Spot</a>
              </Link>
            </div>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
}
