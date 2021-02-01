export const smartistsMemberModifier = (_smartistsMembers) => {
    const smartistsMembers = [..._smartistsMembers];
    smartistsMembers.forEach((smartistsMember, index) => {
      const _smartistsMember = {
        ...smartistsMember,
      };
  
      delete _smartistsMember.signingKeyId;
      delete _smartistsMember.radiksSignature;
      smartistsMembers[index] = _smartistsMember;
    });
    return smartistsMembers;
  };