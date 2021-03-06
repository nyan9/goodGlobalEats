import { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { Image } from "cloudinary-react";
import { SearchBox } from "./searchBox";
import {
  CreateSpotMutation,
  CreateSpotMutationVariables,
} from "src/generated/CreateSpotMutation";
import {
  UpdateSpotMutation,
  UpdateSpotMutationVariables,
} from "src/generated/UpdateSpotMutation";
import { CreateSignatureMutation } from "src/generated/CreateSignatureMutation";

const SIGNATURE_MUTATION = gql`
  mutation CreateSignatureMutation {
    createImageSignature {
      signature
      timestamp
    }
  }
`;

const CREATE_SPOT_MUTATION = gql`
  mutation CreateSpotMutation($input: SpotInput!) {
    createSpot(input: $input) {
      id
    }
  }
`;

const UPDATE_SPOT_MUTATION = gql`
  mutation UpdateSpotMutation($id: String!, $input: SpotInput!) {
    updateSpot(id: $id, input: $input) {
      id
      image
      publicId
      address
      latitude
      longitude
      appetizer
      entree
      drink
    }
  }
`;

interface IUploadImageResponse {
  secure_url: string;
}

async function uploadImage(
  image: File,
  signature: string,
  timestamp: number
): Promise<IUploadImageResponse> {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

  const formData = new FormData();
  formData.append("file", image);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp.toString());
  formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY ?? "");

  const response = await fetch(url, {
    method: "post",
    body: formData,
  });

  return response.json();
}

interface IFormData {
  address: string;
  latitude: number;
  longitude: number;
  appetizer: string;
  entree: string;
  drink: string;
  image: FileList;
}

interface ISpot {
  id: string;
  image: string;
  publicId: string;
  address: string;
  latitude: number;
  longitude: number;
  appetizer: string;
  entree: string;
  drink: string;
}

interface IProps {
  spot?: ISpot;
}

export default function SpotForm({ spot }: IProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const { register, handleSubmit, setValue, errors, watch } = useForm<
    IFormData
  >({
    defaultValues: spot
      ? {
          address: spot.address,
          latitude: spot.latitude,
          longitude: spot.longitude,
          appetizer: spot.appetizer,
          entree: spot.entree,
          drink: spot.drink,
        }
      : {},
  });
  const address = watch("address");

  const [createSignature] = useMutation<CreateSignatureMutation>(
    SIGNATURE_MUTATION
  );
  const [createSpot] = useMutation<
    CreateSpotMutation,
    CreateSpotMutationVariables
  >(CREATE_SPOT_MUTATION);
  const [updateSpot] = useMutation<
    UpdateSpotMutation,
    UpdateSpotMutationVariables
  >(UPDATE_SPOT_MUTATION);

  useEffect(() => {
    register(
      { name: "address" },
      { required: "Please enter name of the spot" }
    );
    register({ name: "latitude" }, { required: true, min: -90, max: 90 });
    register({ name: "longitude" }, { required: true, min: -180, max: 180 });
  }, [register]);

  const handleCreate = async (data: IFormData) => {
    const { data: signatureData } = await createSignature();

    if (signatureData) {
      const { signature, timestamp } = signatureData.createImageSignature;
      const imageData = await uploadImage(data.image[0], signature, timestamp);

      const { data: spotData } = await createSpot({
        variables: {
          input: {
            address: data.address,
            image: imageData.secure_url,
            coordinates: {
              latitude: data.latitude,
              longitude: data.longitude,
            },
            appetizer: data.appetizer,
            entree: data.entree,
            drink: data.drink,
          },
        },
      });

      if (spotData?.createSpot) {
        router.push(`/spots/${spotData.createSpot.id}`);
      }
    }
  };

  const handleUpdate = async (currentSpot: ISpot, data: IFormData) => {
    let image = currentSpot.image;

    if (data.image[0]) {
      const { data: signatureData } = await createSignature();
      if (signatureData) {
        const { signature, timestamp } = signatureData.createImageSignature;
        const imageData = await uploadImage(
          data.image[0],
          signature,
          timestamp
        );
        image = imageData.secure_url;
      }
    }

    const { data: spotData } = await updateSpot({
      variables: {
        id: currentSpot.id,
        input: {
          image: image,
          address: currentSpot.address,
          coordinates: {
            latitude: currentSpot.latitude,
            longitude: currentSpot.longitude,
          },
          appetizer: data.appetizer,
          entree: data.entree,
          drink: data.drink,
        },
      },
    });

    if (spotData?.updateSpot) {
      router.push(`/spots/${currentSpot.id}`);
    }
  };

  const onSubmit = (data: IFormData) => {
    setSubmitting(false);
    if (!!spot) {
      handleUpdate(spot, data);
    } else {
      handleCreate(data);
    }
  };

  return (
    <form className="mx-auto max-w-xl py-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl my-8">
        {spot ? `Editing ${spot.address}` : "Recommend a Spot"}
      </h1>

      <div className="mt-4">
        <label htmlFor="search" className="block mb-2">
          Search for your spot
        </label>

        <SearchBox
          onSelectSpot={(address, latitude, longitude) => {
            setValue("address", address);
            setValue("latitude", latitude);
            setValue("longitude", longitude);
          }}
          defaultValue={spot ? spot.address : ""}
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
                  if (spot || fileList.length === 1) return true;
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

            {previewImage ? (
              <img
                src={previewImage}
                className="mt-4 object-cover"
                style={{ width: "576px", height: `${(16 / 9) * 576}px` }}
              />
            ) : spot ? (
              <Image
                className="mt-4"
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={spot.publicId}
                alt={spot.address}
                secure
                dpr="auto"
                quality="auto"
                width={576}
                height={Math.floor((9 / 16) * 576)}
                crop="fill"
                gravity="auto"
              />
            ) : null}
            {errors.image && <p>{errors.image.message}</p>}
          </div>

          <div className="mt-4">
            <label htmlFor="recommended_app" className="block mt-12 mb-2">
              Must Try Appetizer:
            </label>
            <input
              id="recommended_app"
              name="appetizer"
              type="text"
              className="p-2 w-full"
              ref={register()}
            />
            {errors.appetizer && <p>{errors.appetizer.message}</p>}

            <label htmlFor="recommended_entree" className="block mt-8 mb-2">
              Must Try Entree:
            </label>
            <input
              id="recommended_entree"
              name="entree"
              type="text"
              className="p-2 w-full"
              ref={register()}
            />
            {errors.entree && <p>{errors.entree.message}</p>}

            <label htmlFor="recommended_drinks" className="block mt-8 mb-2">
              Must Try Drink:
            </label>
            <input
              id="recommended_drink"
              name="drink"
              type="text"
              className="p-2 w-full"
              ref={register()}
            />
            {errors.drink && <p>{errors.drink.message}</p>}
          </div>

          <div className="mt-16">
            <button
              className="bg-green-500 hover:bg-green-700 font-bold py-2 px-4 rounded mr-6"
              type="submit"
              disabled={submitting}
            >
              Put everybody on!
            </button>

            <div className="bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded inline-block">
              <Link href={spot ? `/spots/${spot.id}` : "/"}>
                <a>Cancel</a>
              </Link>
            </div>
          </div>
        </>
      )}
    </form>
  );
}
