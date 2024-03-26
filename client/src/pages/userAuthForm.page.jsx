import axios from "axios";
import { useContext, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../App";
import AnimationWrapper from "../common/page-animation";
import { storeInSession } from "../common/session";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";

const UserAuthForm = ({ type }) => {
  const authForm = useRef();

  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);
  // console.log(access_token)

  const UserAuthThroughServer = (serverRoute, formData) => {
    // console.log(import.meta.env.VITE_SERVER_DOMAIN  + serverRoute, formData);
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        // console.log(sessionStorage)
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute = type == "sign-in" ? "/signin" : "/signup";

    let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    // formData
    let form = new FormData(authForm.current);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    // validating the data from frontend
    const { fullname, email, password } = formData;

    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Fullname must be atleast 3 letters long");
      }
    }

    if (!email.length) {
      return toast.error("Enter Email");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be greater than 6 characters and less than 20 characters, must include 1 number , 1 lowercase, 1 uppercase"
      );
    }

    UserAuthThroughServer(serverRoute, formData);
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex item-center justify-center">
        <Toaster />
        <form ref={authForm} className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "sign-in" ? "Welcome back" : "Join us today"}
          </h1>

          {type != "sign-in" ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}
          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />
          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />

          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>
          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>
          <button className="btn-dark flex item-center justify-center gap-4 w-[90%] center">
            <img src={googleIcon} className="w-5" />
            continue with google
          </button>

          {type == "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              {`Don't have an account ?`}
              <Link to="/signup" className="underline text-black">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member ?
              <Link to="/signin" className="underline text-black">
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};
export default UserAuthForm;
