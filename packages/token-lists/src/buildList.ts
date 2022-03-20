import fs from "fs";
import path from "path";
import { TokenList } from "@uniswap/token-lists";
import { version as twinkleswapDefaultVersion } from "../lists/twinkleswap-default.json";
import { version as twinkleswapExtendedVersion } from "../lists/twinkleswap-extended.json";
import { version as twinkleswapTop15Version } from "../lists/twinkleswap-top-15.json";
import { version as twinkleswapTop100Version } from "../lists/twinkleswap-top-100.json";
import { version as coingeckoVersion } from "../lists/coingecko.json";
import { version as twinkleswapMiniVersion } from "../lists/twinkleswap-mini.json";
import { version as twinkleswapMiniExtendedVersion } from "../lists/twinkleswap-mini-extended.json";
import twinkleswapDefault from "./tokens/twinkleswap-default.json";
import twinkleswapExtended from "./tokens/twinkleswap-extended.json";
import twinkleswapTop100 from "./tokens/twinkleswap-top-100.json";
import twinkleswapTop15 from "./tokens/twinkleswap-top-15.json";
import coingecko from './tokens/coingecko.json'
import twinkleswapMini from "./tokens/twinkleswap-mini.json";
import twinkleswapMiniExtended from "./tokens/twinkleswap-mini-extended.json";

export enum VersionBump {
  "major" = "major",
  "minor" = "minor",
  "patch" = "patch",
}

type Version = {
  major: number;
  minor: number;
  patch: number;
};

const lists = {
  "twinkleswap-default": {
    list: twinkleswapDefault,
    name: "TwinkleSwap Default",
    keywords: ["twinkleswap", "default"],
    logoURI: "https://twinkleswap.finance/logo.png",
    sort: false,
    currentVersion: twinkleswapDefaultVersion,
  },
  "twinkleswap-extended": {
    list: twinkleswapExtended,
    name: "TwinkleSwap Extended",
    keywords: ["twinkleswap", "extended"],
    logoURI: "https://twinkleswap.finance/logo.png",
    sort: true,
    currentVersion: twinkleswapExtendedVersion,
  },
  "twinkleswap-top-100": {
    list: twinkleswapTop100,
    name: "TwinkleSwap Top 100",
    keywords: ["twinkleswap", "top 100"],
    logoURI: "https://twinkleswap.finance/logo.png",
    sort: true,
    currentVersion: twinkleswapTop100Version,
  },
  "twinkleswap-top-15": {
    list: twinkleswapTop15,
    name: "TwinkleSwap Top 15",
    keywords: ["twinkleswap", "top 15"],
    logoURI: "https://twinkleswap.finance/logo.png",
    sort: true,
    currentVersion: twinkleswapTop15Version,
  },
  "coingecko": {
    list: coingecko,
    name: "CoinGecko",
    keywords: ["defi"],
    logoURI: "https://www.coingecko.com/assets/thumbnail-007177f3eca19695592f0b8b0eabbdae282b54154e1be912285c9034ea6cbaf2.png",
    sort: true,
    currentVersion: coingeckoVersion,
  },
  "twinkleswap-mini": {
    list: twinkleswapMini,
    name: "TwinkleSwap Mini",
    keywords: ["twinkleswap", "astar", "mini program", "mini"],
    logoURI: "https://twinkleswap.finance/logo.png",
    sort: true,
    currentVersion: twinkleswapMiniVersion,
  },
  "twinkleswap-mini-extended": {
    list: twinkleswapMiniExtended,
    name: "TwinkleSwap Mini Ext",
    keywords: ["twinkleswap", "astar", "mini program", "mini", "extended"],
    logoURI: "https://twinkleswap.finance/logo.png",
    sort: true,
    currentVersion: twinkleswapMiniExtendedVersion,
  },
};

const getNextVersion = (currentVersion: Version, versionBump?: VersionBump) => {
  const { major, minor, patch } = currentVersion;
  switch (versionBump) {
    case VersionBump.major:
      return { major: major + 1, minor, patch };
    case VersionBump.minor:
      return { major, minor: minor + 1, patch };
    case VersionBump.patch:
    default:
      return { major, minor, patch: patch + 1 };
  }
};

export const buildList = (listName: string, versionBump?: VersionBump): TokenList => {
  const { list, name, keywords, logoURI, sort, currentVersion } = lists[listName];
  const version = getNextVersion(currentVersion, versionBump);
  return {
    name,
    timestamp: new Date().toISOString(),
    version,
    logoURI,
    keywords,
    // sort them by symbol for easy readability (not applied to default list)
    tokens: sort
      ? list.sort((t1, t2) => {
          if (t1.chainId === t2.chainId) {
            // CAKE first in extended list
            if ((t1.symbol === "CAKE") !== (t2.symbol === "CAKE")) {
              return t1.symbol === "CAKE" ? -1 : 1;
            }
            return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
          }
          return t1.chainId < t2.chainId ? -1 : 1;
        })
      : list,
  };
};

export const saveList = (tokenList: TokenList, listName: string): void => {
  const tokenListPath = `${path.resolve()}/lists/${listName}.json`;
  const stringifiedList = JSON.stringify(tokenList, null, 2);
  fs.writeFileSync(tokenListPath, stringifiedList);
  console.info("Token list saved to ", tokenListPath);
};
