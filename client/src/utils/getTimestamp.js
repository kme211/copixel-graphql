function pad(num) {
  if (num.toString().length < 2) {
    return `0${num}`;
  }
  return num;
}

export default function getTimestamp() {
  const dt = new Date();
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(
    dt.getUTCDate()
  )} ${pad(dt.getUTCHours())}:${pad(dt.getUTCMinutes())}+0000`;
}
