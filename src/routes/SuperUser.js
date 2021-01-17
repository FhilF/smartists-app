import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import WelcomePage from "../pages/Welcome";
import SignUpPage from "../pages/SignUp";

function SuperUserRoutes(props) {
  const {setSmartistsUser} = props;
  return (
    <>
      <Switch>
        <Route
          exact
          path="/"
          Component
          render={(routeProps) => <WelcomePage {...routeProps} />}
        />
        <Route
          exact
          path="/account-setup"
          Component
          render={(routeProps) => <SignUpPage {...routeProps} setSmartistsUser={setSmartistsUser}/>}
        />
        {/* <Route
          path="/profile/:username"
          Component
          render={(routeProps) => <ProfilePage {...routeProps} {...props}/>}
        />
        <Route
          path="/studio/:username"
          Component
          render={(routeProps) => <StudioPage {...routeProps} {...props}/>}
        /> */}
        {/* <Route
          path="/signup"
          Component
          render={(routeProps) => <FormPage {...routeProps}/>}
        /> */}
      </Switch>
    </>
  );
}

export default SuperUserRoutes;
