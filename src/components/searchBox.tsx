import { ChangeEvent } from "react";
import { FunctionComponent } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getDetails,
} from "use-places-autocomplete";
import { useGoogleMapsScript, Libraries } from "use-google-maps-script";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useRouter } from "next/router";

interface ISearchBoxProps {
  onSelectSpot: (
    address: string,
    latitude: number | null,
    longtitude: number | null
  ) => void;
  defaultValue: string;
}

const libraries: Libraries = ["places"];

export function SearchBox({ onSelectSpot, defaultValue }: ISearchBoxProps) {
  const { isLoaded, loadError } = useGoogleMapsScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    libraries,
  });

  if (!isLoaded) return null;
  if (loadError) return <div>Erorr loading...</div>;

  return (
    <SpotSearchBox onSelectSpot={onSelectSpot} defaultValue={defaultValue} />
  );
}

function SpotSearchBox({ onSelectSpot, defaultValue }: ISearchBoxProps) {
  const { pathname } = useRouter();
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300, defaultValue });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    if (e.target.value === "") {
      onSelectSpot("", null, null);
    }
  };

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      //   const details = await getDetails({ placeId: results[0].place_id });

      onSelectSpot(address, lat, lng);
    } catch (error) {
      console.error(`🚨🚨🚨 Error: ${error}`);
    }
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        id="search"
        className="w-full p-2"
        value={value}
        onChange={handleChange}
        disabled={!ready}
        placeholder={
          pathname !== "/"
            ? "Enter name or address of the restaurant"
            : "Enter a city, state, or zip code"
        }
        autoComplete="off"
      />

      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
}
