import React from "react";

function NotArtist(props) {
  const { isSessionedUser } = props;
  return (
    <div className="w-full mt-12 px-8">
      <div className="mt-32 flex justify-center">
        <h3 className="text-base text-gray-400">
          {isSessionedUser
            ? "This page is only for artist"
            : "Member is not an artist"}
        </h3>
      </div>
    </div>
  );
}

export default NotArtist;
