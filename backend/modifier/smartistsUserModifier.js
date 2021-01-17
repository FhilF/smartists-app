export const smartistsUserModifier = (_smartistsUsers) => {
    const smartistsUsers = [..._smartistsUsers];
    smartistsUsers.forEach((smartistsUser, index) => {
      const _smartistsUser = {
        ...smartistsUser,
      };
  
      delete _smartistsUser.signingKeyId;
      delete _smartistsUser.radiksSignature;
      smartistsUsers[index] = _smartistsUser;
    });
    return smartistsUsers;
  };