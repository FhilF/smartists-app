export const entriesModifier = (_entries) => {
  const entries = [..._entries];
  entries.forEach((entry, index) => {
    const _entry = {
      ...entry,
    };

    const dare = _entry.dare;
    const durranUser = _entry.durranUser;

    if (Array.isArray(dare) && dare.length) {
      delete dare[0].signingKeyId;
      delete dare[0].radiksSignature;
      _entry.dare = dare[0];
    }

    if (Array.isArray(dare) && !dare.length) {
      _entry.dare = [];
    }

    if (!Array.isArray(dare)) {
      _entry.dare = [];
    }

    if (Array.isArray(durranUser) && durranUser.length) {
      delete durranUser[0].signingKeyId;
      delete durranUser[0].radiksSignature;
      _entry.durranUser = durranUser[0];
    }

    if (Array.isArray(durranUser) && !durranUser.length) {
      _entry.durranUser = [];
    }

    if (!Array.isArray(durranUser)) {
      _entry.durranUser = [];
    }
    
    delete _entry.dareId;
    delete _entry.signingKeyId;
    delete _entry.radiksSignature;
    entries[index] = _entry;
  });
  return entries;
};
