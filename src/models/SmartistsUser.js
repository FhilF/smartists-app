import { Model, User } from 'radiks';

export default class SmartistsUser extends Model {
  static className = 'SmartistsUser';

  static schema = {
    name: {
      type: String,
      decrypted: true,
    },
    username: {
      type: String,
      decrypted: true,
    },
    isArtist: {
      type: String,
      decrypted: true,
    },
    isArtUser: {
      type: String,
      decrypted: true,
    },
  };
}
