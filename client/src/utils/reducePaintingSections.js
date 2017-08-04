export default function reducePaintingSections(paintings) {
  return paintings.map(painting => {
    return Object.assign(
      {},
      painting,
      {
        pixels: painting.sections
          .map(section => section.data)
          .reduce((a, b) => Object.assign(a, b), {})
      },
      { sections: null }
    );
  });
}
