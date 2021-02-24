import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import WelcomePage from "../pages/Welcome";
import SignUpPage from "../pages/SignUp";
import NotFound from "../pages/NotFound";
import Documentation from "../pages/Documentation";

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
        <Route
          exact
          path="/documentation"
          Component
          render={(routeProps) => <Documentation {...routeProps}/>}
        />
        <Route
          path="404"
          render={(routeProps) => <NotFound {...routeProps} />}
        />

        <Route render={(routeProps) => <NotFound {...routeProps} />} />
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
