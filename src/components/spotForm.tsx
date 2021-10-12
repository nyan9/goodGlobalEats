import { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
// import { useMutation, gql } from "@apollo/client";
// import { useRouter } from "next/router";
// import Link from "next/link";
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
  bedrooms: string;
  image: FileList;
}

interface IProps {}

export default function SpotForm({}: IProps) {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, setValue, errors, watch } = useForm<
    IFormData
  >({ defaultValues: {} });

  useEffect(() => {
    register(
      { name: "address" },
      { required: "Please enter name of the spot" }
    );
    register({ name: "latitude" }, { required: true, min: -90, max: 90 });
    register({ name: "longitude" }, { required: true, min: -180, max: 180 });
  }, [register]);

  const handleCreate = async (data: IFormData) => {};

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
    </form>
  );
}
