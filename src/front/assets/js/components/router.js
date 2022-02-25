const createRouter = () => {

    function navigate(route, external = false) {
        location.href = external ? route : `${location.origin}${route}`;
    }

    return {
        navigate
    }
}

export { createRouter };