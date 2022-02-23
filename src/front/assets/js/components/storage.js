const AppStorage = {
    _storageKey: 'storage-app-data',

    data: {},

    loadData() {
        AppStorage.data = JSON.parse(localStorage.getItem(AppStorage._storageKey) || '{}');
        return AppStorage.data;
    },

    saveData(data = AppStorage.data) {
        localStorage.setItem(AppStorage._storageKey, JSON.stringify(data));
    },

    clearData() {
        AppStorage.data = {};
        localStorage.clear();
    }
}

export { AppStorage };