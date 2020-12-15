import { Model, User } from "radiks";

export default class Studio extends Model {
  static className = "Studio";

  static schema = {
    username: {
      type: String,
      decrypted: true,
    },
    banner: {
      type: String,
      decrypted: true,
    },
    artworks: {
      type: String,
      decrypted: true,
    },
  };
}
