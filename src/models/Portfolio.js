import { Model, User } from "radiks";

export default class Portfolio extends Model {
  static className = "Portfolio";

  static schema = {
    title: {
      type: String,
      decrypted: true,
    },
    description: {
      type: String,
      decrypted: true,
    },
    media: {
      type: String,
      decrypted: true,
    },
    studioId: {
      type: String,
      decrypted: true,
    },
  };
}
