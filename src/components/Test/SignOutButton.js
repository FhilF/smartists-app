import React, { useState } from "react";

import { useConnect } from "@blockstack/connect";
import { useBlockstack } from 'react-blockstack';

function SignOutButton() {
  const { doOpenAuth } = useConnect();
  const { signOut, userSession } = useBlockstack();
  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault();
          userSession.signUserOut(window.location.origin);
          signOut();
        }}
      >
        Sign out
      </button>
    </div>
  );
}

export default SignOutButton;
