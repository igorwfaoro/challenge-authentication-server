const ELEMENT_ID = 'app-loader';

/**
 * @param {Document} document
 */
const createLoader = (document) => {
    function open() {
        const el = document.getElementById(ELEMENT_ID);
        el.style.display = 'flex';
    }

    function dismiss() {
        const el = document.getElementById(ELEMENT_ID);
        el.style.display = 'none';
    }

    function createElement() {
        const el = document.createElement('div');
        el.style.display = 'none';
        el.id = ELEMENT_ID;

        const elLoader = document.createElement('div');
        elLoader.classList.add('loader');

        const elSpinner = document.createElement('div');
        elSpinner.classList.add('spinner');

        const elText = document.createElement('div');
        elText.classList.add('loader-text');
        elText.innerText = 'Loading...';

        elSpinner.appendChild(document.createElement('div'));
        elLoader.appendChild(elSpinner);
        elLoader.appendChild(elText);
        el.appendChild(elLoader);
        document.body.appendChild(el);
    }

    return {
        open,
        dismiss,
        createElement
    }
}

export { createLoader };