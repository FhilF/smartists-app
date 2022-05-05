import { React, useEffect } from "react";
import Header from "./Header";
import UserRoutes from "routes/User";

function Index(props) {
  const { setIsNewSignIn } = props;
  return (
    <div>
      <Header setIsNewSignIn={setIsNewSignIn} />
      <div className="h-full flex flex-col">
        <div className="h-full flex-grow" style={{ marginTop: "60px" }}>
          <UserRoutes setIsNewSignIn={setIsNewSignIn}/>
        </div>
      </div>
    </div>
  );
}

export default Index;
