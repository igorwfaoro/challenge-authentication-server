let appData = {};
const STORAGE_KEY = 'storage-app-data';

const createAppStorage = () => {

    function loadData() {
        appData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return appData;
    }

    function saveData(data = appData) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function clearData() {
        appData = {};
        localStorage.clear();
    }

    function getData() {
        return appData;
    }

    return {
        loadData,
        saveData,
        clearData,
        getData
    }
}

export { createAppStorage };