import { useEffect, useState, React, use, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Context from "./Context";
// import Navbar from "./Navbar";
// import ProfileContext from "./ProfileContext";
// import Swal from "sweetalert2";

const Login = () => {
  const [role, setrole] = useState(true);
  // let { backend_url, Toast, Toast_2, setisAdmin } = useContext(ProfileContext);
const {setuserData} = useContext(Context)
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [formData, setformData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const logInUser = (e) => {
    e.preventDefault();
    setisLoading(true);
    // Toast.fire({
    //   icon: "info",
    //   title: "Logging in..",
    // });
    axios
      // .post(`${backend_url}/user/login`, formData, {
      //   withCredentials: true,
      // })
      .post(`http://localhost:4002/user/log-in`, formData, {
        withCredentials: true,
      })
      .then(function (response) {
        console.log(response);
        setisLoading(false);
        setuserData(response.data.data.loggedInUser)
        localStorage.removeItem("accessToken");
        localStorage.setItem("accessToken", response.data.data.accessToken);
        navigate("/chat")
        // let userDetails = [response.data.data.loggedInUser];
        //console.log(userDetails, userDetails[0].isAdmin);
        // Swal.close();
        // Toast_2.fire({
        //   icon: "info",
        //   title: "Logged In successfully",
        // });
        // if (userDetails[0].isAdmin == true) {
        //   navigate("/dashboard/admin", { state: { userData: userDetails[0] } });
        //   setisAdmin(true);
        // } else {
        //   navigate("/dashboard/student", {
        //     state: { userData: userDetails[0] },
        //   });
        //   setisAdmin(false);
        // }
      })
      .catch(function (error) {
        setisLoading(false);
        // Toast_2.fire({
        //   icon: "error",
        //   title: "Failed to Log In",
        // });
        // setTimeout(() => {
        //   Toast_2.fire({
        //     icon: "info",
        //     title: `${error.response.data.message}`,
        //   });
        // }, 2000);
        console.log(error);
      });
  };

  const changeUserData = (e) => {
    const { name, value } = e.target;
    setformData((prev) => ({ ...prev, [name]: value }));
  };
  // useEffect(() => {
  //   return () => {
  //     console.log(formData);
  //   };
  // }, [formData]);

  const changeRole = (e) => {
    let value = e.target.value === "true";
    setrole(value);
  };

  return (
    <>
      {/* <Navbar isLoggedIn={false} /> */}
      <div className="flex justify-center">
        <div className="signup w-[90vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] p-[1rem_1.5rem] mt-[5rem] bg-white flex flex-col justify-center items-center rounded-[0.75rem]">
          <header className="text-[1.5rem] font-bold">Sign In</header>
          <form
            onSubmit={logInUser}
            onChange={changeUserData}
            className="mt-[1rem] w-[100%]"
          >
            <div className="labels">
              <label htmlFor="name">username</label>
              <input type="text" name="username" required />
            </div>
            <div className="labels">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" required />
            </div>
            <div className="labels">
              <label htmlFor="name">Password</label>
              <input type="password" name="password" required />
            </div>
            {/* <div className="flex justify-evenly mt-[10px]">
              <div>
                <input
                  type="radio"
                  name="isAdmin"
                  value={false}
                  onChange={changeRole}
                  checked={!role}
                  className="mr-[5px]"
                />
                Student
              </div>
              <div>
                <input
                  type="radio"
                  name="isAdmin"
                  value={true}
                  onChange={changeRole}
                  checked={role}
                  className="mr-[5px]"
                />
                Admin
              </div>
            </div> */}
            <div className="flex flex-col items-center gap-[1rem] mt-[1.5rem] ">
              <button type="submit">Sign In</button>
              {isLoading ? (
                <span className="relative flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                </span>
              ) : (
                ""
              )}
              <div className="flex gap-2">
                <p>Don't have an account ?</p>
                <p
                  className="text-[#402ae9] font-bold cursor-pointer"
                  // onClick={() => navigate("/")}
                >
                  Sign Up
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
