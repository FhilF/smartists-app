import React, { useState, useEffect } from "react";
import { UserGroup, GroupMembership } from "radiks";
import Button from "../../customComponents/Button";

import { useBlockstack } from "react-blockstack";
function Radiks(props) {
  const { userSession } = useBlockstack();
  const { history } = props;
  const [groups, setGroups] = useState([]);
  const [isFetchingList, setIsFetchingList] = useState(true);
  const createGroup = () => {
    const group = new UserGroup({ name: "My Group Name" });
    group.create().then((res) => {
      console.log(res);
    });
  };

  const fetchList = () => {
    setIsFetchingList(true);
    UserGroup.myGroups()
      .then((res) => {
        console.log(res);
        // setGroups(res);
        setIsFetchingList(false);
      })
      .catch((err) => {
        console.log(err);
        setIsFetchingList(false);
      });
  };

  const fetchGroup = async () =>{
    const userData = userSession.loadUserData();
    GroupMembership.fetchUserGroups().then((res) => {
      console.log(res);
      // setGroups(res);
    })
    .catch((err) => {
      console.log(err);
    });

  }

  useEffect(() => {
    // console.log(UserGroup)
    // console.log(GroupMembership)
    fetchList();

    fetchGroup()
  }, []);
  return (
    <div>
      <Button
        onClick={(e) => {
          e.preventDefault();
          createGroup();
        }}
      >
        Create Group
      </Button>

      {!isFetchingList && (
        <ul>
          {groups.map((el, i) => {
            return (
              <li key={i}>
                {el.attrs.name}
                <Button
                  link="group"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push({
                      pathname: `/group/${el.attrs._id}`,
                    });
                  }}
                >View</Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Radiks;
