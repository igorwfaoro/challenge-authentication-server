import { AppStorage } from '/js/components/storage.js';

const HttpClient = {

    _getToken() {
        return AppStorage.data?.token;
    },

    get(url, options) {
        const token = HttpClient._getToken();

        return axios.get(url, {
            ...options,
            headers: {
                Authorization: token ? `Bearer ${HttpClient._getToken()}` : ''
            }
        });
    },

    post(url, payload, options) {
        const token = HttpClient._getToken();

        return axios.post(url, payload, {
            ...options,
            headers: {
                Authorization: token ? `Bearer ${HttpClient._getToken()}` : ''
            }
        });
    }
}

export { HttpClient };