import React, { useState } from "react";
import {forgotPassword } from "../../api/auth";
import { useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const {updateNotification} = useNotification();

  const handleChange = ({target}) => {
    const  value  = target.value;
    //value is their actual values of that fields
    setEmail(value );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //check if email is valid or not
    if(!isValidEmail(email)) return updateNotification('error',"Invalid email");


    //send the mail to backend API (forget-password) and the corresponding
    //controller(of forget-password ) will send the email with link to that user.

    //we will response as a error or message of 'link sent' from backend
    const {error, message}=await forgotPassword(email);

    //if any error in send the link
    if(error) return updateNotification('error',error);

    //if no error that means we have send a link
    updateNotification('success',message);
  };

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-96"}>
          <Title>Please Enter Your Email</Title>
          <FormInput
            onChange={(e) => handleChange(e)}
            value={email}
            label="Email"
            placeholder="john@email.com"
            name="email"
          />
          <Submit value="Send Link" />

          <div className="flex justify-between">
            <CustomLink to="/auth/signin">Sign in</CustomLink>
            <CustomLink to="/auth/signup">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
