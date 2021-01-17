import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import HomePage from "../pages/Home";
import ProfileRoot from "../layouts/ProfileRoot";
import FormPage from "../pages/SignUp";

function SmartistsUser(props) {
  const { smartistsUser, isfetchingUser } = props;
  return (
    <>
      <Switch>
        <Route
          exact
          path="/"
          Component
          render={(routeProps) => <HomePage {...routeProps} />}
        />
        {/* <Route
          path="/profile/:username"
          Component
          render={(routeProps) => <ProfilePage {...routeProps} {...props} />}
        /> */}
        

        <Route
          path="/profile/:username"
          render={(routeProps) => (
            <ProfileRoot {...routeProps} smartistsUser={smartistsUser}/>
            
          )}
        />
        {/* <Route
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

export default SmartistsUser;
