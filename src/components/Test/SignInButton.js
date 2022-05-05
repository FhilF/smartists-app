import React, { useState } from "react";

import { useConnect } from "@blockstack/connect";

function SignInButton() {
  // const { doOpenAuth } = useConnect();
  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault();
          // doOpenAuth(true);
        }}
      >
        SignIn
      </button>
    </div>
  );
}

export default SignInButton;
