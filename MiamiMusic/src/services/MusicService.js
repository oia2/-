import $api from "../http";

export default class MusicService {
    static async fetchMusic() {
        return $api.get('/tracks');
    }
}
