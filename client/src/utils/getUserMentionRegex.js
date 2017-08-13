let regex;

/**
 * 
 * @param {String} username 
 */
export default function getUserMentionRegex(username) {
  if (!regex) regex = new RegExp(`(@${username})(\\.|\\?|,|;|!)*$`, "g");
  return regex;
}
