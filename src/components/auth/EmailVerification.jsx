import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resendEmailVerificationToken, verifyUserEmail } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import FormContainer from "../form/FormContainer";
import Submit from "../form/Submit";
import Title from "../form/Title";

const OTP_LENGTH = 6;
let currentOTPIndex;

const isValidOTP = (otp) => {
  let valid = false;

  for (let val of otp) {
    valid = !isNaN(parseInt(val));
    if (!valid) break;
  }

  return valid;
};

export default function EmailVerification() {
  //array of length 6, filled with empty elements
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  const { isAuth, authInfo } = useAuth();
  const { isLoggedIn, profile } = authInfo;
  const isVerified  = profile?.isVerified;

  const inputRef = useRef();
  const { updateNotification } = useNotification();

  const { state } = useLocation();
  const user = state?.user;

  const navigate = useNavigate();

  const focusNextInputField = (index) => {
    setActiveOtpIndex(index + 1);
  };

  const focusPrevInputField = (index) => {
    let nextIndex;
    const diff = index - 1;
    nextIndex = diff !== 0 ? diff : 0;
    setActiveOtpIndex(nextIndex);
  };

  const handleOtpChange = ({ target }) => {
    const { value } = target;
    const newOtp = [...otp];
    // These three dots are called the spread syntax or spread operator.
    //  The spread syntax is a feature of ES6, and it's also used in React.
    //  Spread syntax allows you to deconstruct an array or object into separate variables.
    newOtp[currentOTPIndex] = value.substring(value.length - 1, value.length);

    //if we press backspace the number will be removed i.e value will be null so, when
    //its null we will move to previous index
    if (!value) focusPrevInputField(currentOTPIndex);
    else focusNextInputField(currentOTPIndex);
    setOtp([...newOtp]);
  };


  const handleOTPResend=async ()=>{

    //send a request to backend API to resend a OTP
    const {error,message}=await resendEmailVerificationToken(user.id)

    //if there is any error from backend, update the notification
    if(error){
      return updateNotification('error',error);
    }

    //if there is no any error, update notification with the message
    updateNotification('success',message);

  }

  const handleKeyDown = ({ key }, index) => {
    currentOTPIndex = index;
    if (key === "Backspace") {
      focusPrevInputField(currentOTPIndex);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //check if OTP is valid or not
    if (!isValidOTP(otp)) {
      return updateNotification("error", "invalid OTP");
    }

    // submit otp

    // 'verifyEmail' in backend is accepting OTP and userID from request and
    // 'verifyUserEmail is to transfer this OTP and userID to the backend through axios
    const {
      error,
      message,
      user: userResponse,
    } = await verifyUserEmail({
      OTP: otp.join(""),
      userId: user.id,
    });
    if (error) return updateNotification("error", error);

    updateNotification("success", message);

    //we now need to redirect user to another screen, we will do it using isAuth middelware
    //the response is coming from 'verify-email' controller in backend which has jwtToken, and we will store
    //jwtToken in local storage to verify the user with isAuth middleware which requires
    //jwtToken to verify the user.
    //And this middelware itself will redirect it to home page using
    //isLoggedIn( which will be updated by isAuth) and navigate hook
    localStorage.setItem("auth-token", userResponse.token);

    //call isAuth to verify the user  using localStorage token and redirect to another screen
    //isAuth will find some token in local storage thats why we are storing it before calling isAuth

    isAuth();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (!user) navigate("/not-found");
    if (isLoggedIn && isVerified) navigate("/");
  }, [user, isLoggedIn, isVerified]);

  // if(!user) return null

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses}>
          <div>
            <Title>Please enter the OTP to verify your account</Title>
            <p className="text-center dark:text-dark-subtle text-light-subtle">
              OTP has been sent to your email
            </p>
          </div>

          <div className="flex justify-center items-center space-x-4">
            {otp.map((_, index) => {
              return (
                <input
                  ref={activeOtpIndex === index ? inputRef : null}
                  key={index}
                  type="number"
                  value={otp[index] || ""}
                  onChange={handleOtpChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 border-2 dark:border-dark-subtle  border-light-subtle darK:focus:border-white focus:border-primary rounded bg-transparent outline-none text-center dark:text-white text-primary font-semibold text-xl spin-button-none"
                />
              );
            })}
          </div>
          <div>
            <Submit value="Verify Account" />
            <button
            onClick={handleOTPResend}
              type="button"
              className="dark:text-white text-blue-500
            hover:underline mt-2"
            >
              I don't have OTP
            </button>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
