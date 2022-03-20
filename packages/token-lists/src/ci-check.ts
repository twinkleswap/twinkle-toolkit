import srcDefault from "./tokens/twinkleswap-default.json";
import srcExtended from "./tokens/twinkleswap-extended.json";
import srcTop100 from "./tokens/twinkleswap-top-100.json";
import srcTop15 from "./tokens/twinkleswap-top-15.json";
import srcCoingecko from "./tokens/coingecko.json";
import srcMini from "./tokens/twinkleswap-mini.json";
import srcMiniExtended from "./tokens/twinkleswap-mini-extended.json";
import defaultList from "../lists/twinkleswap-default.json";
import extendedtList from "../lists/twinkleswap-extended.json";
import top15List from "../lists/twinkleswap-top-15.json";
import top100tList from "../lists/twinkleswap-top-100.json";
import coingeckoList from "../lists/coingecko.json";
import miniList from "../lists/twinkleswap-mini.json";
import miniExtendedList from "../lists/twinkleswap-mini-extended.json";

const lists = [
  {
    name: "twinkleswap-default",
    src: srcDefault,
    actual: defaultList,
  },
  {
    name: "twinkleswap-extended",
    src: srcExtended,
    actual: extendedtList,
  },
  {
    name: "twinkleswap-top-15",
    src: srcTop15,
    actual: top15List,
  },
  {
    name: "twinkleswap-top-100",
    src: srcTop100,
    actual: top100tList,
  },
  {
    name: "coingeckoList",
    src: srcCoingecko,
    actual: coingeckoList
  },
  {
    name: "twinkleswap-mini",
    src: srcMini,
    actual: miniList,
  },
  {
    name: "twinkleswap-mini-extended",
    src: srcMiniExtended,
    actual: miniExtendedList,
  },
];

const compareLists = (listPair) => {
  const { name, src, actual } = listPair;
  if (src.length !== actual.tokens.length) {
    throw Error(
      `List ${name} seems to be not properly regenerated. Soure file has ${src.length} tokens but actual list has ${actual.tokens.length}. Did you forget to run yarn makelist?`
    );
  }
  src.sort((t1, t2) => (t1.address < t2.address ? -1 : 1));
  actual.tokens.sort((t1, t2) => (t1.address < t2.address ? -1 : 1));
  src.forEach((srcToken, index) => {
    if (JSON.stringify(srcToken) !== JSON.stringify(actual.tokens[index])) {
      throw Error(
        `List ${name} seems to be not properly regenerated. Tokens from src/tokens directory don't match up with the final list. Did you forget to run yarn makelist?`
      );
    }
  });
};

/**
 * Check in CI that author properly updated token list
 * i.e. not just changed token list in src/tokens but also regenerated lists with yarn makelist command.
 * Github Action runs only on change in src/tokens directory.
 */
const ciCheck = (): void => {
  lists.forEach((listPair) => {
    compareLists(listPair);
  });
};

export default ciCheck;
