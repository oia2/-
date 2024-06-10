const ApiError = require('../exceptions/api-error');
const userService = require('../service/user-service');
const { validationResult } = require('express-validator');
const client = require('../Client');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { email, password } = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getTracks(req, res, next) {
        try {
            const tracks = await userService.getAllTracks();
            return res.json(tracks);
        } catch (e) {
            next(e);
        }
    }

    async likeTrack(req, res, next) {
        try {
            const { userId, trackId } = req.body;
            const track = await userService.likeTraks(userId, trackId);
            return res.json(track);
        } catch (e) {
            next(e);
        }
    }

    async isLiked(req, res, next) {
        try {
            const { userId, trackId } = req.body;

            if (!userId || !trackId) {
                throw new Error("User ID or Track ID is missing");
            }

            const checkLikedQuery = 'SELECT * FROM public."PlayListsMusic" pm INNER JOIN public."PlayLists" p ON pm."playlistid" = p."playlistid" INNER JOIN public."UsersPlayLists" up ON p."playlistid" = up."playlistid" WHERE up."userid" = $1 AND pm."musicid" = $2 AND p."title" = $3';
            const checkLikedResult = await client.query(checkLikedQuery, [userId, trackId, "Мне нравится"]);

            return res.json({ isLiked: checkLikedResult.rows.length > 0 });
        } catch (e) {
            console.error("Error in isLiked:", e);
            next(e);
        }
    }

    async unlikeTrack(req, res, next) {
        try {
            const { userId, trackId } = req.body;

            if (!userId || !trackId) {
                throw new Error("User ID or Track ID is missing");
            }

            const deleteTrackQuery = 'DELETE FROM public."PlayListsMusic" WHERE "playlistid" IN (SELECT p."playlistid" FROM public."PlayLists" p INNER JOIN public."UsersPlayLists" up ON p."playlistid" = up."playlistid" WHERE up."userid" = $1 AND p."title" = $2) AND "musicid" = $3';
            await client.query(deleteTrackQuery, [userId, "Мне нравится", trackId]);

            return res.json({ message: 'Track unliked successfully' });
        } catch (e) {
            console.error("Error in unlikeTrack:", e);
            next(e);
        }
    }

    async getUserPlaylists(req, res, next) {
        try {
            const { userId } = req.query;
            if (!userId) {
                throw new Error("User ID is missing");
            }

            const getPlaylistsQuery = 'SELECT * FROM public."PlayLists" p INNER JOIN public."UsersPlayLists" up ON p."playlistid" = up."playlistid" WHERE up."userid" = $1';
            const playlistsResult = await client.query(getPlaylistsQuery, [userId]);

            return res.json(playlistsResult.rows);
        } catch (e) {
            console.error("Error in getUserPlaylists:", e);
            next(e);
        }
    }

    async getPlaylistSongs(req, res, next) {
        try {
            const { playlistId } = req.query;
            if (!playlistId) {
                throw new Error("Playlist ID is missing");
            }

            const getSongsQuery = `
                SELECT m.*
                FROM public."Music" m
                INNER JOIN public."PlayListsMusic" pm ON m."id" = pm."musicid"
                WHERE pm."playlistid" = $1
            `;
            const songsResult = await client.query(getSongsQuery, [playlistId]);

            return res.json(songsResult.rows);
        } catch (e) {
            console.error("Error in getPlaylistSongs:", e);
            next(e);
        }
    }

    async addToPlaylist(req, res, next) {
        try {
            const { userId, trackId, playlistId } = req.body;
            if (!userId || !trackId || !playlistId) {
                throw new Error("User ID, Track ID or Playlist ID is missing");
            }

            const addTrackQuery = 'INSERT INTO public."PlayListsMusic" ("playlistid", "musicid") VALUES ($1, $2)';
            await client.query(addTrackQuery, [playlistId, trackId]);

            return res.json({ message: 'Track added to playlist successfully' });
        } catch (e) {
            console.error("Error in addToPlaylist:", e);
            next(e);
        }
    }

    async createPlaylist(req, res, next) {
        try {
            const { userId, title } = req.body;
            if (!userId || !title) {
                throw new Error("User ID or title is missing");
            }

            const createPlaylistQuery = 'INSERT INTO public."PlayLists" (title) VALUES ($1) RETURNING *';
            const createPlaylistResult = await client.query(createPlaylistQuery, [title]);
            const playlistId = createPlaylistResult.rows[0].playlistid;

            const associatePlaylistQuery = 'INSERT INTO public."UsersPlayLists" ("userid", "playlistid") VALUES ($1, $2)';
            await client.query(associatePlaylistQuery, [userId, playlistId]);

            return res.json(createPlaylistResult.rows[0]);
        } catch (e) {
            console.error("Error in createPlaylist:", e);
            next(e);
        }
    }

    async deletePlaylist(req, res, next) {
        try {
            const { id } = req.params;
            const { userId } = req.body;

            const deleteUserPlaylistQuery = 'DELETE FROM public."UsersPlayLists" WHERE "playlistid" = $1 AND "userid" = $2 RETURNING *';
            const result = await client.query(deleteUserPlaylistQuery, [id, userId]);

            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'Playlist not found' });
            }

            return res.json({ message: 'Playlist deleted successfully' });
        } catch (e) {
            next(e);
        }
    }

    async removeFromPlaylist(req, res, next) {
        try {
            const { userId, trackId, playlistId } = req.body;
            if (!userId || !trackId || !playlistId) {
                throw new Error("User ID, Track ID or Playlist ID is missing");
            }

            const removeTrackQuery = 'DELETE FROM public."PlayListsMusic" WHERE "playlistid" = $1 AND "musicid" = $2';
            await client.query(removeTrackQuery, [playlistId, trackId]);

            return res.json({ message: 'Track removed from playlist successfully' });
        } catch (e) {
            console.error("Error in removeFromPlaylist:", e);
            next(e);
        }
    }

    async isTrackInPlaylist(req, res, next) {
        try {
            const { userId, trackId, playlistId } = req.body;
            if (!userId || !trackId || !playlistId) {
                throw new Error("User ID, Track ID or Playlist ID is missing");
            }

            const checkTrackQuery = 'SELECT * FROM public."PlayListsMusic" WHERE "playlistid" = $1 AND "musicid" = $2';
            const result = await client.query(checkTrackQuery, [playlistId, trackId]);

            return res.json({ isInPlaylist: result.rowCount > 0 });
        } catch (e) {
            console.error("Error in isTrackInPlaylist:", e);
            next(e);
        }
    }

    async checkUser(req, res, next) {
        try {
            const { email } = req.body;
            const checkUserQuery = 'SELECT * FROM public."Users" WHERE "email" = $1';
            const userResult = await client.query(checkUserQuery, [email]);
            return res.json({ exists: userResult.rows.length > 0 });
        } catch (e) {
            console.error("Error in checkUser:", e);
            next(e);
        }
    }

    async checkPlaylist(req, res, next) {
        try {
            const { title } = req.body;
            const checkPlaylistQuery = 'SELECT * FROM public."PlayLists" WHERE "title" = $1';
            const playlistResult = await client.query(checkPlaylistQuery, [title]);
            return res.json({ exists: playlistResult.rows.length > 0 });
        } catch (e) {
            console.error("Error in checkPlaylist:", e);
            next(e);
        }
    }
}

module.exports = new UserController();
