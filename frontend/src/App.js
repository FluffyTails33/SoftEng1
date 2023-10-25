import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { app } from "./config/firebase.config.js";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { setUserDetails, setUserNull } from "./context/actions/userActions";

// TODO: Set defaults for routing and adding routes
// TODO: Destructure routes to make adding additional routes easier
import { Main } from "./containers/Main";
import { Login } from "./containers/Login";
import Loader from "./components/Loader.jsx";
import GlobalAlert from "./containers/components/main/GlobalAlert.jsx";
const App = () => {
  const firebaseAuth = getAuth(app);
  const [isLoading, setIsLoading] = React.useState(false);
  // TODO: Remove verylong css classes from .js and .jsx files, and should just create them as seperate components to make it easier to read and understand each components within the same folder to also allow for reusable components
  // TODO: checking if the user is logged in or not, then dispatching the user details to the redux store
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useSelector((state) => state.alert);

  // TODO: Set the default route to the login page if the user is not logged in, when signing out the user should be redirected to the login page and the session should be retired
  useEffect(() => {
    setIsLoading(true);

    const sessionExpire = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUserDetails(user));
      } else {
        dispatch(setUserNull());
        navigate("/login");
      }

      setIsLoading(false);
    });

    return () => sessionExpire();
  }, [dispatch, firebaseAuth, navigate]);

  // TODO: Fix the loading screen styles
  return (
    <div className="">
      {isLoading && <Loader />}

      <Toaster />
      <Routes>
        <Route path="/*" element={<Main />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      {!isLoading && alert?.type && (
        <GlobalAlert type={alert.type} message={alert.type} />
      )}
    </div>
  );
};

export default App;
