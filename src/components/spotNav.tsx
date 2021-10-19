import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";
import { DeleteSpot, DeleteSpotVariables } from "src/generated/DeleteSpot";

const DELETE_MUTATION = gql`
  mutation DeleteSpot($id: String!) {
    deleteSpot(id: $id)
  }
`;

interface IProps {
  spot: {
    id: string;
    userId: string;
  };
}

export default function SpotNav({ spot }: IProps) {
  const { user } = useAuth();
  const router = useRouter();
  const canEdit = !!user && user.uid === spot.userId;
  const [deleteSpot, { loading }] = useMutation<
    DeleteSpot,
    DeleteSpotVariables
  >(DELETE_MUTATION);

  return (
    <div className="flex mb-6">
      <Link href="/">
        <button className="bg-green-500 hover:bg-green-700 font-bold py-1 px-2 rounded mr-auto">
          Home
        </button>
      </Link>

      {canEdit && (
        <>
          <Link href={`/spots/${spot.id}/edit`}>
            <button className="bg-blue-500 hover:bg-blue-700 font-bold py-1 px-2 rounded mr-2">
              Edit
            </button>
          </Link>

          <button
            className="bg-red-300 hover:bg-red-700 font-semibold py-1 px-2 rounded"
            disabled={loading}
            type="button"
            onClick={async () => {
              if (confirm("Are you sure you want to delete this spot?")) {
                await deleteSpot({ variables: { id: spot.id } });
                router.push("/");
              }
            }}
          >
            DELETE
          </button>
        </>
      )}
    </div>
  );
}
