const jwt = require("jsonwebtoken");
const refreshTokens = [];
function generateAccessToken(credentials) {
    return jwt.sign(credentials, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
}
exports.token = (req, res) => {
    let refresh_token = req.body.refreshToken.split(" ")[1];
    if (!refreshTokens.includes(refresh_token)) return res.send({ error: "Invalid Token" });
    let refreshTokenStatus = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    if (refreshTokenStatus) {
        let accessToken = generateAccessToken({
            username: refreshTokenStatus.username,
            password: refreshTokenStatus.password
        });
        res.send({ accessToken: `Bearer ${accessToken}` });
    } else {
        res.send({ error: "Invalid Token" });
    }
}
exports.login = (req, res) => {
    try {
        let credentials = {
            username: req.body.username,
            password: req.body.password
        }
        let accessToken = generateAccessToken(credentials);
        let refreshToken = jwt.sign(credentials, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);
        res.send({
            accessToken: `Bearer ${accessToken}`,
            refershToken: `Bearer ${refreshToken}`,
        });
    } catch (err) {
        res.send({
            error: err.message
        })
    }
}

exports.secureAPI = (req, res) => {
    var accessToken = req.headers.authorization.split(" ")[1];
    if (!accessToken) return res.send({ error: "Invalid Token" });
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) return res.send({ error: "Invalid Token" });
        res.send("authorized");
    });
}