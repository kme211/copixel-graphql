import jwt from "jsonwebtoken";
import jwksRsa from "jwks-rsa";
import mongoose from "mongoose";
const User = mongoose.model("User");
const verifyJwt = promisify(jwt.verify);

const getToken = (request) => {
  var [ scheme, token ] = req.headers.authorization.split(' ');
  if(!token) throw new Error("No authorization token was found");
  return token;
}

const verifyToken = async (request) => {
  console.log("verifyToken");

  try {
    const token = getToken(request);

    const decoded = await verifyJwt(
      token,
      jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH_DOMAIN}/.well-known/jwks.json`
      }),
      {
        audience: "http://localhost:3000/api", // had to set this up in the APIs section of Auth0
        issuer: `https://${process.env.AUTH_DOMAIN}/`,
        algorithms: ["RS256"]
      }
    );
    console.log("decoded", decoded);
    const auth0UserId = decoded.sub.split("|")[1];
    const user = await User.findOne({ auth0UserId });
    return { error: null, user };
  } catch (e) {
    return { error: e, user: null };
  }
};

export default verifyToken;