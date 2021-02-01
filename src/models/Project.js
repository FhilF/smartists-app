import { Model, User } from "radiks";

export default class Project extends Model {
  static className = "Project";

  static schema = {
    title: {
      type: String,
      decrypted: true,
    },
    tagline: {
      type: String,
      decrypted: true,
    },
    description: {
      type: String,
      decrypted: true,
    },
    requiredSkills: {
      type: String,
      decrypted: true,
    },
    isListeningForAdvice: {
      type: String,
      decrypted: true,
    },
    extraUsers: {
      type: String,
      decrypted: true,
    },
    fileName: {
      type: String,
      decrypted: true,
    },
    studioId:{
      type: String,
      decrypted: true,
    }
  };
}
