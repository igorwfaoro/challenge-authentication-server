import { createAppStorage } from '/js/components/storage.js';
import { createToast } from '/js/components/toast.js';
import { createLoader } from '/js/components/loader.js';
import { createRouter } from '/js/components/router.js';
import { createHttpClient } from '/js/components/http-client.js';

const createAuth = (document) => {

    const AppStorage = createAppStorage();
    const Toast = createToast(document);
    const Loader = createLoader(document);
    const Router = createRouter();
    const HttpClient = createHttpClient();

    function verify() {
        return new Promise((resolve, reject) => {

            if (!AppStorage.getData()?.token) {
                Router.navigate('/login');
                reject();
            } else {
                Loader.open();
                HttpClient.post('/api/auth/refresh').then(response => {
                    Loader.dismiss();
                    resolve();
                }).catch(error => {
                    Loader.dismiss();
                    Toast.showHttpError(error);
                    setTimeout(() => logout('You must be logged in to access'), 2000);
                    reject();
                });
            }
        })
    }

    function logout(error) {
        AppStorage.clearData();
        Router.navigate(`/login${error ? '?error=' + error : ''}`);
    }

    return {
        verify,
        logout
    }
}

export { createAuth };