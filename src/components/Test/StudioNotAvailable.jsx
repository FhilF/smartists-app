import React from "react";
import Button from "customComponents/Button";
import { useNavigate, useLocation, useParams } from "react-router-dom";

function StudioNotAvailable() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  return (
    <div className="mt-16 px-8">
      <div class="w-full h-0.5 mt-1 bg-gray-100"></div>
      <div className="text-center mt-16">
        <h3 className=" text-xl leading-normal text-gray-500">
          This user hasn't set up their studio
        </h3>
        <Button
          className="mt-4"
          onClick={(e) => {
            navigate(`/${params.address}/studio`);
          }}
          variant="contained"
          color="secondary"
          style={{ borderRadius: "20px" }}
        >
          View Studio
        </Button>
      </div>
    </div>
  );
}

export default StudioNotAvailable;
