let token = null;

// Service to get and set the token for the courier adapter
function getToken() { return token; }
function setToken(value) { token = value; }

module.exports = { getToken, setToken };