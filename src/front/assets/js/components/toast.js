const ELEMENT_ID = 'toast';
const DURATION = 3000;

/**
 * @param {Document} document 
 */
const createToast = (document) => {
    function show(message, type) {

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

        const el = document.getElementById(ELEMENT_ID)
        el.innerText = `${message}${typeIcon}`;
        el.classList.add('show');

        setTimeout(() => el.classList.remove('show'), DURATION);
    }

    function showHttpError(error) {
        show(error?.response?.data?.message || 'Something wrong...', 'error');
    }

    function createElement() {
        const el = document.createElement('div');
        el.id = ELEMENT_ID;
        document.body.appendChild(el);
    }

    return {
        show,
        showHttpError,
        createElement
    }
}

export { createToast };