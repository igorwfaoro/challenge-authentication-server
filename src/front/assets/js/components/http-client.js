import { createAppStorage } from '/js/components/storage.js';

const AppStorage = createAppStorage();

const createHttpClient = () => {

    function _getToken() {
        return AppStorage.getData()?.token;
    }

    function get(url, options) {
        const token = options?.token || _getToken();

        return axios.get(url, {
            ...options,
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            }
        });
    }

    function post(url, payload, options) {
        const token = options?.token || _getToken();

        return axios.post(url, payload, {
            ...options,
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            }
        });
    }

    return {
        get,
        post
    }
}

export { createHttpClient };