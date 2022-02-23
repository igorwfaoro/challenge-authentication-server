const Toast = {
    show(message, type) {

        let typeIcon = '';
        switch (type) {
            case 'success':
                typeIcon = ' ✔';
                break;
            case 'info':
                typeIcon = ' ℹ';
                break;
            case 'error':
                typeIcon = ' ❌';
                break;
            default:
                typeIcon = '';
                break;
        }

        alert(`${message}${typeIcon}`);
    },

    showHttpError(error) {
        Toast.show(error?.response?.data?.message || 'Something wrong...', 'error');
    }
}

export { Toast };