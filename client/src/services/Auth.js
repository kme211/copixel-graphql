export default class Auth {
  constructor() {
    const { CLIENT_ID, DOMAIN } = process.env;
    this.lock = new Auth0Lock(CLIENT_ID, DOMAIN, {
      auth: {
        responseType: "token",
        audience: `http://localhost:3000/api`,
        params: { scope: "openid" },
        redirect: false
      }
    });
    this.lock.on("authenticated", this.doAuthentication.bind(this));
  }
  authenticate() {
    this.lock.show();
  }

  get token() {
    return localStorage.getItem('token');
  }

  set token(value) {
    if(value) localStorage.setItem('token', value);
    else localStorage.removeItem('token');
  }
}
