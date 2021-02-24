import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import HomePage from "../pages/Home";
import ProfileRoot from "../layouts/ProfileRoot";
import StudioRoot from "../layouts/Studio";
import FormPage from "../pages/SignUp";
import Member from "../pages/Member";
import NotFound from "../pages/NotFound";
import MemberEdit from "../pages/MemberEdit";
import RadiksPage from "../pages/SampleRadiks/Radiks";
import GroupPage from "../pages/SampleRadiks/Group";

function SmartistsUser(props) {
  const { smartistsUser, isfetchingUser, setSmartistsUser } = props;
  return (
    <>
      <Switch>
        <Route
          exact
          path="/"
          Component
          render={(routeProps) => (
            <HomePage {...routeProps} smartistsUser={smartistsUser} />
          )}
        />

        <Route
          path="/member/:username/edit"
          render={(routeProps) => (
            <MemberEdit
              {...routeProps}
              smartistsUser={smartistsUser}
              setSmartistsUser={setSmartistsUser}
            />
          )}
        />

        <Route
          path="/member/:username"
          render={(routeProps) => (
            <Member {...routeProps} smartistsUser={smartistsUser} />
          )}
        />

        <Route
          path="/studio/:username"
          render={(routeProps) => (
            <StudioRoot {...routeProps} smartistsUser={smartistsUser} />
          )}
        />

        <Route
          path="404"
          render={(routeProps) => <NotFound {...routeProps} />}
        />

        <Route render={(routeProps) => <NotFound {...routeProps} />} />

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
