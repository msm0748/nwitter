import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fBase.js";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    //로그인이나 로그아웃 변화 감지
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setUserObj(user);
        //user의 정보를 받아옴
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Init..."}
      {/* <footer>&copy; {new Date().getFullYear()} Nwitter</footer> */}
    </>
  );
}

export default App;
