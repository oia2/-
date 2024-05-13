
const client = require('../Client');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(email, password) {
        const checkUserQuery = 'SELECT * FROM public."Users" WHERE email = $1';
        const checkUserResult = await client.query(checkUserQuery, [email]);
        const candidate = checkUserResult.rows[0];

        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }

        const createUserQuery = 'INSERT INTO public."Users" (email, password, activationlink) VALUES ($1, $2, $3) RETURNING *';
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        
        const createUserResult = await client.query(createUserQuery, [email, hashPassword, activationLink]);
        
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        const user = createUserResult.rows[0];
        
        // Создаем DTO пользователя
        const userDto = {
            email: user.email,
            id: user.id,
            isActivated: user.isActivated
        };

        // Генерируем токены для пользователя
        const tokens = tokenService.generateTokens(userDto);
        
        // Сохраняем refresh token в базе данных
        await tokenService.saveToken(user.id, tokens.refreshToken);

        return {
            ...tokens, user:  userDto
        }
    }

    async activate(activationLink) {
        const checkUserQuery = 'SELECT * FROM public."Users" WHERE activationlink = $1';
        const checkUserResult = await client.query(checkUserQuery, [activationLink]);
        const user = checkUserResult.rows[0];

        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка активации')
        }

        const updateUserQuery = 'UPDATE public."Users" SET isactivated = true WHERE activationlink = $1';
        await client.query(updateUserQuery, [activationLink]);
    }

    async login(email, password) {
            const checkUserQuery = 'SELECT * FROM public."Users" WHERE email = $1';
            const checkUserResult = await client.query(checkUserQuery, [email]);
            const user = checkUserResult.rows[0];
            if (!user) {
                throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} не найден`)
            }
            const isPassEquals = await bcrypt.compare(password, user.password);
            if(!isPassEquals) {
                throw ApiError.BadRequest('Неверный пароль');
            }
            const userDto = {
                email: user.email,
                id: user.id,
                isActivated: user.isActivated
            };
    
            const tokens = tokenService.generateTokens(userDto);
            await tokenService.saveToken(user.id, tokens.refreshToken);
            return {
                ...tokens, user:  userDto
            }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken){
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const checkUserQuery = 'SELECT * FROM public."Users" WHERE id = $1';
        const checkUserResult = await client.query(checkUserQuery, [userData.id]);
        const user = checkUserResult.rows[0];
        const userDto = {
            email: user.email,
            id: user.id,
            isActivated: user.isActivated
        };
        const tokens = tokenService.generateTokens(userDto);
        await tokenService.saveToken(user.id, tokens.refreshToken);
        return {
             ...tokens, user:  userDto
        }
    }

    async getAllTracks() {
        const checkUserQuery = 'SELECT title, author, img, url FROM public."Music"';
        const checkUserResult = await client.query(checkUserQuery);
        const users = checkUserResult.rows;
        return users
    }


}

module.exports = new UserService();