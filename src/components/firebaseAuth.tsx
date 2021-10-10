import { FunctionComponent, useState, useEffect } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";
import { useRouter } from "next/router";

const firebaseAuthConfig = {
  signInFlow: "popup",
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
  ],
  signInSuccessUrl: "/",
};

const guestUser = {
  email: "guestuser@guest.com",
  password: "guestuser123",
};

const FirebaseAuth: FunctionComponent = () => {
  const [renderAuth, setRenderAuth] = useState(false);
  const router = useRouter();

  // styledFirebaseAuth sometimes has a problem where it doesn't like to be rendered on the server
  // lifecycle trick to only render styledFirebaseAuth after the first render (after server-side render)
  useEffect(() => {
    setRenderAuth(true);
  }, []);

  const loginGuestUser = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(guestUser.email, guestUser.password)
      .then(() => {
        router.push("/");
      })
      .catch((e) => console.error(e));
  };

  return (
    <div className="mt-16">
      {renderAuth && (
        <StyledFirebaseAuth
          uiConfig={firebaseAuthConfig}
          firebaseAuth={firebase.auth()}
        />
      )}
      <button
        className="bg-yellow-400 px-4 py-2 rounded-sm block mx-auto mt-8 font-semibold"
        onClick={loginGuestUser}
      >
        Continue as guest
      </button>
    </div>
  );
};

export default FirebaseAuth;
