import { createAppStorage } from '/js/components/storage.js';

const AppStorage = createAppStorage();

const createHttpClient = () => {

    function _getToken() {
        return AppStorage.getData()?.token;
    }

    function get(url, options) {
        const token = _getToken();

        return axios.get(url, {
            ...options,
            headers: {
                Authorization: token ? `Bearer ${_getToken()}` : ''
            }
        });
    }

    function post(url, payload, options) {
        const token = _getToken();

        return axios.post(url, payload, {
            ...options,
            headers: {
                Authorization: token ? `Bearer ${_getToken()}` : ''
            }
        });
    }

    return {
        get,
        post
    }
}

export { createHttpClient };