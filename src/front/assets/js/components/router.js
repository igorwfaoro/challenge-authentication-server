const createRouter = () => {

    function navigate(route, external = false) {
        location.href = external ? route : `${location.origin}${route}`;
    }

    function getUrlParam(key) {
        const urlQuery = new URLSearchParams(location.search);
        return urlQuery.get(key);
    }

    return {
        navigate,
        getUrlParam
    }
}

export { createRouter };