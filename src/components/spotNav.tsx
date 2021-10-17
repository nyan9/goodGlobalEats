import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";
// import { DeleteSpot, DeleteSpotVariables } from "src/generated/DeleteSpot";

interface IProps {
  spot: {
    id: string;
    userId: string;
  };
}

export default function SpotNav({ spot }: IProps) {
  const { user } = useAuth();
  const canEdit = !!user && user.uid === spot.userId;

  return (
    <>
      <Link href="/">
        <a> Home </a>
      </Link>
      {canEdit && (
        <>
          {" | "}
          <Link href={`/spots/A${spot.id}/edit`}>
            <a>Edit</a>
          </Link>
        </>
      )}
    </>
  );
}
