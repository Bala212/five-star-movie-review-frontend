import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIsAuth, signInUser } from "../api/auth";
import { useNotification } from "../hooks";

export const AuthContext = createContext();

const defaultAuthInfo = {
  profile: null,
  isLoggedIn: false,
  isPending: false,
  error: "",
};

export default function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo });

  const {updateNotification} = useNotification();

  const navigate = useNavigate();
  //inside this handleLogin, we are just making this sign   in request to our backend api with
  //email and password
  const handleLogin = async (email, password) => {

    //user tried to login so isPending will be true i.e login process is still pending!
    setAuthInfo({ ...authInfo, isPending: true });

    //send the request to backend to sign-in the user and fetch the response (error and user)
    const { error, user } = await signInUser({ email, password });

    //if there is error we will return isPending as false and error as  received error.
    if (error) {
      updateNotification('error',error);
      return setAuthInfo({ ...authInfo, isPending: false, error });
    }

    // The useNavigate hook returns a function that lets you navigate programmatically,
    //  for example after a form is submitted. If using replace: true , the navigation
    //  will replace the current entry in the history stack instead of adding a new one.
    navigate("/",{replace:true})

    //if there is no error we will set isPending to false bcoz we are done with the login of the user
    //and isLoggedIn as true,error will be null and set a profile as a 'user' which is the json response we get from the backend
    //which has jwtToken
    setAuthInfo({
      profile: { ...user },
      isPending: false,
      isLoggedIn: true,
      error: "",
    });

    //the token we passed is a jwtToken, which we have created at signing in
    localStorage.setItem("auth-token", user.token);
  };


  //to check whether the user is authenticated or not
  const isAuth = async () => {

    //fetch token from local storage and check if it is valid or not
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    //still signing in so isPending should be true
    setAuthInfo({ ...authInfo, isPending: true });
 
    //if token is valid then send it to backend api to check whether user is valid or not
    // backend route 'is-auth' will return user body or error    
    const { error, user } = await getIsAuth(token);
    if (error) {
      updateNotification('error',error);
      return setAuthInfo({ ...authInfo, isPending: false, error });
    }

    //if there is no error we will set isPending to false bcoz we are done with the login of the user
    //and isLoggedIn as true,error will be null and set a profile as a 'user' which is the json response we get from the backend
    //which has jwtToken
    setAuthInfo({
      profile: { ...user },
      isLoggedIn: true,
      isPending: false,
      error: "",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    setAuthInfo({ ...defaultAuthInfo });
  };

  useEffect(() => {
    isAuth();
  }, []);

  //  handleLogout
  return (
    <AuthContext.Provider
      value={{ authInfo, handleLogin, handleLogout, isAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
