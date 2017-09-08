export function autopopulate(fieldStr) {
  return function(next) {
    this.populate(fieldStr);
    next();
  };
}
