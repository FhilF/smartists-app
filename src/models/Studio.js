import { Model, User } from "radiks";

export default class Studio extends Model {
  static className = "Studio";

  static schema = {
    username: {
      type: String,
      decrypted: true,
    },
    featuredPortfolio: {
      type: String,
      decrypted: true,
    },
  };
}
