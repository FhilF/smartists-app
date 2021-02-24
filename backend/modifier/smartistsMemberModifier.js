export const smartistsMemberModifier = (_smartistsMembers) => {
  const smartistsMembers = [..._smartistsMembers];
  smartistsMembers.forEach((smartistsMember, index) => {
    const _smartistsMember = {
      ...smartistsMember,
    };

    if (_smartistsMember.hasOwnProperty("studio")) {
      if (_smartistsMember.studio.length !== 0) {
        _smartistsMember.studio = smartistsMemberStudioModifier(
          _smartistsMember.studio
        );
      } else {
        _smartistsMember.studio = {};
      }
    }

    delete _smartistsMember.signingKeyId;
    delete _smartistsMember.radiksSignature;
    smartistsMembers[index] = _smartistsMember;
  });
  return smartistsMembers;
};

const smartistsMemberStudioModifier = (_studio) => {
  let studio;
  if (_studio.length !== 0) {
    studio = _studio[0];
    delete studio.signingKeyId;
    delete studio.radiksSignature;
  }
  return studio;
};
