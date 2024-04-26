const jwt = require('jsonwebtoken');
const client = require('../Client');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const checkTokenQuery = 'SELECT * FROM public."Tokens" WHERE userId = $1';
        const checkTokenResult = await client.query(checkTokenQuery, [userId]);
        const tokenData = checkTokenResult.rows[0];
        
        let token;
        if (tokenData) {
            const updateTokenQuery = 'UPDATE public."Tokens" SET refreshToken = $1 WHERE userId = $2 RETURNING *';
            const updateTokenResult = await client.query(updateTokenQuery, [refreshToken, userId]);
            token = updateTokenResult.rows[0];
        } else {
            const insertTokenQuery = 'INSERT INTO public."Tokens"(userId, refreshToken) VALUES($1, $2) RETURNING *';
            const insertTokenResult = await client.query(insertTokenQuery, [userId, refreshToken]);
            token = insertTokenResult.rows[0];
        }
    
        return token;
    }

    async removeToken(refreshToken) {
        const deleteTokenQuery = 'DELETE FROM public."Tokens" WHERE refreshToken = $1 RETURNING *';
        const deleteTokenResult = await client.query(deleteTokenQuery, [refreshToken]);
        const tokenData = deleteTokenResult.rows[0];
        return tokenData;
    }

    async findToken(refreshToken) {
        const checkTokenQuery= 'SELECT * FROM public."Tokens" WHERE refreshToken = $1';
        const checkTokenResult = await client.query(checkTokenQuery, [refreshToken]);
        const tokenData = checkTokenResult.rows[0];
        return tokenData;
    }
}

module.exports = new TokenService();