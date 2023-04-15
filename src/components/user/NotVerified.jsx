import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import Container from "../Container";

export default function NotVerified() {
  const { authInfo } = useAuth();

  //fetch isLoggedin and isVerified from auth Info
  //and profile will contain the user information
  const { isLoggedIn } = authInfo;
  const isVerified = authInfo.profile?.isVerified;
  const navigate = useNavigate();
  const navigateToVerification = () => {
    //we need to send the user state to this route so that
    //it will display if and only if the user is present
    navigate("auth/verification", { state: { user: authInfo.profile } });
  };

  return (
    <div>
      {isLoggedIn && !isVerified ? (
        <p className="text-lg text-center bg-blue-50 p-2">
          It looks like you haven't verified your account,
          <button
            className="text-blue-500 font-semibold hover:underline"
            onClick={navigateToVerification}
          >
            Click here top verify your account.
          </button>
        </p>
      ) : null}
    </div>
  );
}
