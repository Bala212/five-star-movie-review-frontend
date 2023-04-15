import React, { useEffect, useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { useNavigate, useSearchParams } from "react-router-dom";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import { resetPassword, verifyPasswordResetToken } from "../../api/auth";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";
import { useNotification } from "../../hooks";

export default function ConfirmPassword() {
  //this is used to extract parameter of url, we can also set the params
  //using setUseSearchParams
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState({
    one: "",
    two: "",
  });
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const { updateNotification } = useNotification();
  const navigate = useNavigate();

  //searchParams is an object with full of methods and properties\
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  useEffect(() => {
    isValidToken();
  }, []);

  //check whether the token is valid or not
  const isValidToken = async () => {
    //send token and id from url to backend to verify the token
    const { error, valid } = await verifyPasswordResetToken(token, id);

    //we want to remove indicator of isVerifying
    setIsVerifying(false);

    if (error) {
      navigate("/auth/reset-password", { replace: true });
      return updateNotification("error", error);
    }

    //if token is not valid then remove token ad id from url and send a plain request
    //and replace the previous history
    if (!valid) {
      setIsValid(false);
      return navigate("/auth/reset-password", { replace: true });
    }

    //if token is valid
    setIsValid(true);
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setPassword({ ...password, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //if no password entered
    if (!password.one.trim()) {
      return updateNotification("error", "Password is missing!");
    }


    //check for the length of password
    if (password.one.trim().length < 8) {
      return updateNotification("error", "Password must be 8 characters long!");
    }

    //if they are not equal
    if (password.one !== password.two) {
      return updateNotification("error", "Password do not match!");
    }


    //send the newPassword,userId and token of passwordReset schema to
    //backend api and  reset the password

    //resetPassword controller in backend will have either error regarding resetPassword
    //or a success message
    const {error,message}= await resetPassword({newPassword:password.one,userId:id,token})

    //if any error occurs, update the notification
    if (error) {
      return updateNotification("error", error);
    }

    //if no any error display the success message
    updateNotification('success',message);

    //navigate to signin page to signin again
    navigate('/auth/signin',{replace:true});

  };

  //is VERIFYING
  if (isVerifying)
    return (
      <FormContainer>
        <Container>
          <div className="flex space-x-2 items-center">
            <h1
              className="text-2xl font-semibold dark:text-white
          text-primary"
            >
              Please wait we are verifying your token!
            </h1>
            <ImSpinner3
              className="animate-spin text-2xl dark:text-white
          text-primary"
            />
          </div>
        </Container>
      </FormContainer>
    );

  //If token is not valid
  if (!isValid)
    return (
      <FormContainer>
        <Container>
          <h1
            className="text-2xl font-semibold dark:text-white
          text-primary"
          >
            Sorry the token is invalid!
          </h1>
        </Container>
      </FormContainer>
    );

  //If everything is fine we will render the form to reset password
  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-96"}>
          <Title>Enter New Password</Title>
          <FormInput
            value={password.one}
            onChange={handleChange}
            label="New Password"
            placeholder="********"
            name="one"
            type="password"
          />
          <FormInput
            value={password.two}
            onChange={handleChange}
            label="Confirm Password"
            placeholder="********"
            name="two"
            type="password"
          />
          <Submit value="Confirm Password" />
        </form>
      </Container>
    </FormContainer>
  );
}
