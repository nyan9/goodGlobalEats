import { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
// import { useMutation, gql } from "@apollo/client";
// import { useRouter } from "next/router";
import Link from "next/link";
// import { Image } from "cloudinary-react";
import { SearchBox } from "./searchBox";
// import {
//   CreateSpotMutation,
//   CreateSpotMutationVariables,
// } from "src/generated/CreateSpotMutation";
// import {
//   UpdateSpotMutation,
//   UpdateSpotMutationVariables,
// } from "src/generated/UpdateSpotMutation";
// import { CreateSignatureMutation } from "src/generated/CreateSignatureMutation";

interface IFormData {
  address: string;
  latitude: number;
  longitude: number;
  appetizer: string;
  entree: string;
  drink: string;
  image: FileList;
}

interface IProps {}

export default function SpotForm({}: IProps) {
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const { register, handleSubmit, setValue, errors, watch } = useForm<
    IFormData
  >({ defaultValues: {} });
  const address = watch("address");

  useEffect(() => {
    register(
      { name: "address" },
      { required: "Please enter name of the spot" }
    );
    register({ name: "latitude" }, { required: true, min: -90, max: 90 });
    register({ name: "longitude" }, { required: true, min: -180, max: 180 });
  }, [register]);

  const handleCreate = async (data: IFormData) => {
    console.log(data);
  };

  const onSubmit = (data: IFormData) => {
    setSubmitting(false);
    handleCreate(data);
  };

  return (
    <form className="mx-auto max-w-xl py-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl">Put On a Spot</h1>

      <div className="mt-4">
        <label htmlFor="search" className="block">
          Search for your spot
        </label>
        <SearchBox
          onSelectSpot={(address, latitude, longitude) => {
            setValue("address", address);
            setValue("latitude", latitude);
            setValue("longitude", longitude);
          }}
          defaultValue=""
        />

        {errors.address && <p>{errors.address.message}</p>}
      </div>

      {address && (
        <>
          <div className="mt-4">
            <label
              htmlFor="image"
              className="p-4 border-dashed border-4 border-gray-600 block cursor-pointer"
            >
              Click to add image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={register({
                validate: (fileList: FileList) => {
                  if (fileList.length === 1) return true;
                  return "Please upload one file";
                },
              })}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event?.target?.files?.[0]) {
                  const file = event.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />

            {previewImage && (
              <img
                src={previewImage}
                className="mt-4 object-cover"
                style={{ width: "576px", height: `${(16 / 9) * 576}px` }}
              />
            )}
            {errors.image && <p>{errors.image.message}</p>}
          </div>

          <div className="mt-4">
            <label htmlFor="recommended_app" className="block">
              Must Try Appetizer:
            </label>
            <input
              id="recommended_app"
              name="appetizer"
              type="text"
              className="p-2"
              ref={register()}
            />
            {errors.appetizer && <p>{errors.appetizer.message}</p>}

            <label htmlFor="recommended_entree" className="block">
              Must Try Entree:
            </label>
            <input
              id="recommended_entree"
              name="entree"
              type="text"
              className="p-2"
              ref={register()}
            />
            {errors.entree && <p>{errors.entree.message}</p>}

            <label htmlFor="recommended_drinks" className="block">
              Must Try Drinks:
            </label>
            <input
              id="recommended_drink"
              name="drink"
              type="text"
              className="p-2"
              ref={register()}
            />
            {errors.drink && <p>{errors.drink.message}</p>}
          </div>

          <div className="mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded mr-6"
              type="submit"
              disabled={submitting}
            >
              Put everybody on!
            </button>

            <div className="bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded inline-block">
              <Link href="/">
                <a>Cancel</a>
              </Link>
            </div>
          </div>
        </>
      )}
    </form>
  );
}
