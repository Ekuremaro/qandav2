export const server = 'https://localhost:7186';

export const webAPIUrl = `${server}/api`;

export const authSettings = {
  domain: 'dev-qw1ss4-u.us.auth0.com',
  client_id: 'your-clientid',
  redirect_uri: window.location.origin + '/signin-callback',
  scope: 'openid profile QandAAPI email',
  audience: 'https://qanda',
};