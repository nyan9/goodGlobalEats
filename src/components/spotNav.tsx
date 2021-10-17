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
    <>
      <Link href="/">
        <a> Home </a>
      </Link>
      {canEdit && (
        <>
          {" | "}

          <Link href={`/spots/${spot.id}/edit`}>
            <a>Edit</a>
          </Link>

          {" | "}

          <button
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
    </>
  );
}
