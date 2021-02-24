import { Model, User } from "radiks";

export default class Test extends Model {
  static className = "Test";

  static schema = {
    title: {
      type: String,
      decrypted: true,
    },
    description: {
      type: String,
      encrypted: true,
    },
    
  };

}
