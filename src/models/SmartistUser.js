import { Model, User } from 'radiks';

export default class SmartistUser extends Model {
  static className = 'SmartistUser';

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
