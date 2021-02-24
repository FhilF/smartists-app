import React, { useState, useEffect } from "react";
import { UserGroup } from "radiks";

import StandardInput from "../../customComponents/StandardInput";
import Button from "../../customComponents/Button";

function Group(props) {
  const { history, match } = props;
  const [group, setGroup] = useState({});
  const [inviteeName, setInviteeName] = useState(null);
  const [isFetchingGroup, setIsFetchingGroup] = useState(true);
  const fetchGroup = () => {
    setIsFetchingGroup(true);
    const groupId = match.params.groupId;
    UserGroup.findById(groupId)
      .then((res) => {
        setGroup(res);
        setIsFetchingGroup(false);
      })
      .catch((err) => {
        setIsFetchingGroup(false);
        console.log(err);
      });
  };

  const invite = () => {
    group.makeGroupMembership(inviteeName).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    // fetchGroup();
  }, []);

  useEffect(() => {
    console.log(group)
  }, [group]);
  return (
    <div>
      <div>
        <StandardInput
          lassName="mt-20"
          label="Title"
          id="image-title"
          value={inviteeName ? inviteeName : ""}
          onChange={(e) => {
            setInviteeName(e.target.value);
          }}
          autoComplete="off"
          required
        />
        <Button
          onClick={(e) => {
            e.preventDefault();
            invite();
          }}
        >
          Invite
        </Button>
      </div>
    </div>
  );
}

export default Group;
