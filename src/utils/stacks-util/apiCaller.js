import {
  cvToString,
  cvToJSON,
  hexToCV,
  deserializeCV,
  uintCV,
  cvToHex,
} from "@stacks/transactions";

import axios from "axios";
import { StacksApiUrl } from "config";

export const fetchMapEntry = async (
  contractAddress,
  contractName,
  mapEntry,
  keyEnd
) => {
  let keyStart = 1;
  let arrayList = [];
  for (let i = keyStart; i <= keyEnd; i++) {
    let data = cvToHex(uintCV(i));

    let url = `${StacksApiUrl}/v2/map_entry/${contractAddress}/${contractName}/${mapEntry}`;

    try {
      const result = await axios({
        method: "POST",
        url,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(data),
      });
      const deserialized = deserializeCV(result.data.data);
      if (cvToString(deserialized) !== "none") {
        arrayList.push({
          id: i,
          data: deserialized.value.data,
          contractAddress,
          contractName,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return arrayList;
};
