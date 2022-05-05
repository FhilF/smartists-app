import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiServer } from "config";
import SmartistsMemberCard from "components/SmartistsMemberCard";
import { useNavigate } from "react-router-dom";
import { isMainnet } from "config";


function Members() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [smartistsUserList, setSmartistsUserList] = useState([]);
  useEffect(() => {
    axios.get(`${apiServer}/smartistsUsers`).then((res) => {
      setSmartistsUserList([...res.data.smartistsUserList]);
      setIsLoading(false);
    });
  }, []);
  

  return (
    <div>
      {!isLoading && (
        <div>
          <div className="mt-20 mb-6">
            <p className="text-2xl font-semibold leading-loose">
              Smartists Members
            </p>
          </div>
          <div className="box-border max-w-7xl mx-auto md:masonry before:box-inherit after:box-inherit">
            {smartistsUserList.map((el, i) => {
              return (
                <div key={i} className="">
                  <SmartistsMemberCard smartistsMember={el} studioLink={true} navigate={navigate} isMainnet={isMainnet}/>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Members;
