import getLocalCoords from "./getLocalCoords";

test("getLocalCoords should take the painting coords and return the local section coords", () => {
  expect(getLocalCoords(0, 0, 0, 0, 300, 300)).toEqual([0, 0]);
  expect(getLocalCoords(20, 20, 0, 0, 300, 300)).toEqual([20, 20]);
  expect(getLocalCoords(320, 320, 1, 1, 300, 300)).toEqual([20, 20]);
  expect(getLocalCoords(300, 0, 1, 0, 300, 300)).toEqual([0, 0]);
  expect(getLocalCoords(280, 320, 0, 1, 300, 300)).toEqual([280, 20]);
  expect(getLocalCoords(0, 290, 0, 1, 310, 310)).toEqual([0, 0]);
});
