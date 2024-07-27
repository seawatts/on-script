import { describe, it } from "vitest";

import { parseScriptFromUrl } from "../client";

const movieScripts = {
  // "Apollo 13 - Houston we have a problem": {
  //   code: "HZVQPQ",
  //   pages: [1, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66],
  //   url: "https://sfy.ru/?script=apollo13",
  // },
  // "Back to the Future": {
  //   code: "HIAUIY",
  //   pages: [1, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80],
  //   url: "https://www.dailyscript.com/scripts/bttf4th.pdf",
  // },
  // "Braveheart - Freedom": {
  //   code: "FJWZVC",
  //   pages: [1, 34, 35, 36, 37, 38, 39, 40],
  //   url: "https://imsdb.com/scripts/Braveheart.html",
  // },
  // "Dark Knight - Why so serious": {
  //   code: "VSQIEB",
  //   pages: [1, 32, 33, 34, 35],
  //   url: "https://www.nolanfans.com/library/pdf/thedarkknight-screenplay.pdf",
  // },
  // "Forest Gump": {
  //   code: "ZDJQTA",
  //   pages: [1, 9, 10, 11, 12, 13, 14],
  //   url: "https://imsdb.com/scripts/Forrest-Gump.html",
  // },
  // "Forest Gump v2": {
  //   code: "TSGQMO",
  //   pages: [1, 2, 3],
  //   url: "https://imsdb.com/scripts/Forrest-Gump.html",
  // },
  "Good Will Hunting": {
    code: "WOKVKZ",
    pages: [1, 73, 74, 75, 76, 77, 78, 79, 80],
    url: "https://imsdb.com/scripts/Good-Will-Hunting.html",
  },
  "Harry Potter and the Sorcerer's Stone": {
    code: "OFTTLB",
    pages: [1, 35, 36, 37, 38, 39, 40, 41, 42],
    url: "https://assets.scriptslug.com/live/pdf/scripts/harry-potter-and-the-sorcerers-stone-2001.pdf",
  },
  "Inception - the kick": {
    code: "EUUFXB",
    pages: [1, 104, 105, 106, 107, 108, 109, 110],
    url: "https://imsdb.com/scripts/Inception.html",
  },
  "Princess Bride": {
    code: "OHIEAT",
    pages: [1, 19, 20, 21, 22, 23, 24, 25],
    url: "https://imsdb.com/scripts/Princess-Bride,-The.html",
  },
  "Pulp Fiction": {
    code: "EYVBOR",
    pages: [1, 87, 88, 89, 90, 91, 92, 93, 94],
    url: "https://imsdb.com/scripts/Pulp-Fiction.html",
  },
  Shawshank: {
    code: "PWEYIG",
    pages: [1, 59, 60, 61, 62, 63],
    url: "https://imsdb.com/scripts/Shawshank-Redemption,-The.html",
  },
  "Star Wars: A New Hope": {
    code: "BSAYLP",
    pages: [
      1, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
      74, 75, 76, 77, 78, 79,
    ],
    url: "https://imsdb.com/scripts/Star-Wars-A-New-Hope.html",
  },
  "The Matrix": {
    code: "ODCZDL",
    pages: [1, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
    url: "http://www.scifiscripts.com/scripts/matrix_96_draft.txt",
  },
  "Titanic - King of the world": {
    code: "CMMYUV",
    pages: [1, 54, 55, 56, 57],
    url: "https://imsdb.com/scripts/Titanic.html",
  },
};

// Iterate over the movieScripts object

describe("ai", () => {
  it("should convert pdf to images", async () => {
    for (const [key, { pages, url, code }] of Object.entries(movieScripts)) {
      try {
        await parseScriptFromUrl({ pages, url });
        console.log(`Processed ${key} with code: ${code}`);
      } catch {
        console.log(`Failed to process ${key} with code: ${code}`);
      }
    }
  }, 1_000_000_000);
});
