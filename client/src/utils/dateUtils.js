import moment from "moment-timezone";
const zone = moment.tz.guess();

/**
 * Return a formatted date
 * @param {String} date "2017-08-15 10:52+00:00"
 * @param {String} dateType "relative" or "long"
 * @return {String} formatted date
 */
export function getPrettyDate(dt, dateType) {
  const date = moment(dt).tz(zone);
  if (dateType === "long") {
    return date.format("lll");
  }
  if (dateType === "relative") {
    return date.fromNow();
  }
}

/**
 * Returns if first date is after second date 
 * @param {String} date1 "2017-08-15 10:52+00:00"
 * @param {String} date2 "2017-08-15 11:55+00:00"
 * @param {String} precision 
 * @return {Boolean}
 */
export function isDateAfter(date1, date2, precision) {
  return moment(date1).isAfter(date2, precision);
}
