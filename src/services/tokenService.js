let token = null;

function getToken() {
    return token;
}

function setToken(value) {
    token = value;
}

module.exports = { getToken, setToken };