import React, { useState, useEffect } from "react";
import Button from "../../customComponents/Button";

import TestModel from "../../models/Test";
import { useBlockstack } from "react-blockstack";
function Radiks(props) {
  const { userSession } = useBlockstack();
  const { history } = props;

  const createTest = () => {
    const testModel = new TestModel({
      title: "test",
      description: "this is encrypted",
    })
    testModel.save().then((res)=>{
      console.log(res)
    })
  };

  
  useEffect(() => {
    // const files=[];
    // userSession
    // .listFiles(function (filename) {
    //   files.push(filename);
    //   console.log(filename);
    //   return true; // to continue files listing
    // })
    // .then(function (filesCount) {
    //   // console.log("Files count: " + filesCount);
    // });

    // const options = {
    //   decrypt: false,
    // };
  

    // userSession
    //   .getFile(
    //     "Test/64fa0e3d6cdc-47b7-9851-d5753a12bf7a",
    //     options
    //   )
    //   .then((fileData) => {
    //     console.log(fileData);
    //   });

    // TestModel.fetchOwnList().then((res)=>{
    //   console.log(res)
    // })

    

    TestModel.fetchList().then((res)=>{
      console.log(res)
    })
    console.log(TestModel)
  }, []);
  return (
    <div>
      <Button
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        Create Group
      </Button>
    </div>
  );
}

export default Radiks;
