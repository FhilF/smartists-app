import { Model, User } from "radiks";

export default class FeaturedArtwork extends Model {
  static className = "FeaturedArtwork";

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
