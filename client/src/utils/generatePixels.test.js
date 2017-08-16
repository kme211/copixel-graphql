import generatePixels from "./generatePixels";

test("generates pixels correctly for pos: 0,0", () => {
  const options = {
    sectionX: 0,
    sectionY: 0,
    color: "#ffffff",
    widthPx: 2,
    heightPx: 2,
    blockSizePx: 1
  };
  expect(generatePixels(options)).toEqual({
    "0,0": { color: "#ffffff" },
    "0,1": { color: "#ffffff" },
    "1,0": { color: "#ffffff" },
    "1,1": { color: "#ffffff" }
  });
});

test("generates pixels correctly for pos: 20,20", () => {
  const options = {
    sectionX: 20,
    sectionY: 20,
    color: "#000000",
    widthPx: 2,
    heightPx: 2,
    blockSizePx: 1
  };

  expect(generatePixels(options)).toEqual({
    "40,40": { color: "#000000" },
    "40,41": { color: "#000000" },
    "41,40": { color: "#000000" },
    "41,41": { color: "#000000" }
  });
});

test("generates pixels correctly for pos: 0,0 with a 20px block size", () => {
  const options = {
    sectionX: 0,
    sectionY: 0,
    color: "#000000",
    widthPx: 40,
    heightPx: 40,
    blockSizePx: 20
  };

  expect(generatePixels(options)).toEqual({
    "0,0": { color: "#000000" },
    "0,20": { color: "#000000" },
    "20,0": { color: "#000000" },
    "20,20": { color: "#000000" }
  });
});
