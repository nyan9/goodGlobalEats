import Link from "next/link";
import { Image } from "cloudinary-react";
import { SpotsQuery_spots } from "src/generated/SpotsQuery";
import { MutableRefObject, useEffect, useRef } from "react";

interface IProps {
  spots: SpotsQuery_spots[];
  highlightedListId: string | null;
  setHighlightedMarkId: (id: string | null) => void;
}

export default function SpotList({
  spots,
  highlightedListId,
  setHighlightedMarkId,
}: IProps) {
  const lItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lItemRef.current) {
      lItemRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [highlightedListId]);

  return (
    <>
      {spots.map((spot) => (
        <Link key={spot.id} href={`/spots/${spot.id}`}>
          <div
            ref={highlightedListId === spot.id && lItemRef}
            className={`px-6 pt-4 cursor-pointer flex flex-wrap ${
              highlightedListId === spot.id ? "litem-active" : ""
            }`}
            onMouseEnter={() => setHighlightedMarkId(spot.id)}
            onMouseLeave={() => setHighlightedMarkId(null)}
          >
            <div className="sm:w-full md:w-1/2">
              <Image
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={spot.publicId}
                alt={spot.address}
                secure
                dpr="auto"
                quality="auto"
                width={350}
                height={Math.floor((9 / 16) * 350)}
                crop="fill"
                gravity="auto"
              />
            </div>
            <div className="sm:w-full md:w-1/2 sm:pl-0 md:pl-4">
              <h2 className="text-lg">{spot.address}</h2>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
