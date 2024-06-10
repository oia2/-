const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const router = new Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/tracks', userController.getTracks);
router.post('/like', userController.likeTrack);
router.post('/isLiked', userController.isLiked);
router.post('/unlike', userController.unlikeTrack);
router.get('/playlists', userController.getUserPlaylists);
router.get('/playlist-songs', userController.getPlaylistSongs);
router.post('/addToPlaylist', userController.addToPlaylist);
router.post('/createPlaylist', userController.createPlaylist);
router.delete('/playlists/:id', userController.deletePlaylist);
router.post('/removeFromPlaylist', userController.removeFromPlaylist);
router.post('/isTrackInPlaylist', userController.isTrackInPlaylist);
router.post('/checkUser', userController.checkUser);
router.post('/checkPlaylist', userController.checkPlaylist);

module.exports = router;
