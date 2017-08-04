import getCoords from "./getCoords";

test("should get block coords relative to section position: 1,0", () => {
  const event1 = {
    nativeEvent: {
      offsetX: 0,
      offsetY: 0
    }
  };

  expect(getCoords(1, 0, 20, 300, event1)).toEqual([300, 0]);

  const event2 = {
    nativeEvent: {
      offsetX: 31,
      offsetY: 53
    }
  };

  expect(getCoords(1, 0, 20, 300, event2)).toEqual([320, 40]);

  const event3 = {
    nativeEvent: {
      offsetX: 1,
      offsetY: 1
    }
  };

  expect(getCoords(1, 0, 20, 300, event3)).toEqual([300, 0]);
});

test("should get block coords relative to section position: 0,0 for mouse position: 0,0", () => {
  const event = {
    nativeEvent: {
      offsetX: 0,
      offsetY: 0
    }
  };

  expect(getCoords(0, 0, 20, 300, event)).toEqual([0, 0]);
});

test("should get block coords relative to section position: 0,0 for mouse position: 25,25", () => {
  const event = {
    nativeEvent: {
      offsetX: 25,
      offsetY: 25
    }
  };

  expect(getCoords(0, 0, 20, 300, event)).toEqual([20, 20]);
});
