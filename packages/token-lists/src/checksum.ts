import fs from "fs";
import path from "path";
import { getAddress } from "@ethersproject/address";
import twinkleswapDefault from "./tokens/twinkleswap-default.json";
import twinkleswapExtended from "./tokens/twinkleswap-extended.json";
import twinkleswapTop100 from "./tokens/twinkleswap-top-100.json";
import twinkleswapTop15 from "./tokens/twinkleswap-top-15.json";
import coingecko from "./tokens/coingecko.json";
import twinkleswapMini from "./tokens/twinkleswap-mini.json";
import twinkleswapMiniExtended from "./tokens/twinkleswap-mini-extended.json";

const lists = {
  "twinkleswap-default": twinkleswapDefault,
  "twinkleswap-extended": twinkleswapExtended,
  "twinkleswap-top-100": twinkleswapTop100,
  "twinkleswap-top-15": twinkleswapTop15,
  "coingecko": coingecko,
  "twinkleswap-mini": twinkleswapMini,
  "twinkleswap-mini-extended": twinkleswapMiniExtended,
};

const checksumAddresses = (listName: string): void => {
  let badChecksumCount = 0;
  const listToChecksum = lists[listName];
  const updatedList = listToChecksum.reduce((tokenList, token) => {
    const checksummedAddress = getAddress(token.address);
    if (checksummedAddress !== token.address) {
      badChecksumCount += 1;
      const updatedToken = { ...token, address: checksummedAddress };
      return [...tokenList, updatedToken];
    }
    return [...tokenList, token];
  }, []);

  if (badChecksumCount > 0) {
    console.info(`Found and fixed ${badChecksumCount} non-checksummed addreses`);
    const tokenListPath = `${path.resolve()}/src/tokens/${listName}.json`;
    console.info("Saving updated list to ", tokenListPath);
    const stringifiedList = JSON.stringify(updatedList, null, 2);
    fs.writeFileSync(tokenListPath, stringifiedList);
    console.info("Checksumming done!");
  } else {
    console.info("All addresses are already checksummed");
  }
};

export default checksumAddresses;
