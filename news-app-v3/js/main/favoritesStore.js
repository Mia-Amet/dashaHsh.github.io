const FavoritesStore = (function () {
    let sources, instance;

    function getSources() {
        return sources.slice();
    }

    function setSources(sourceArray) {
        sources = sourceArray;
        return sources.splice();
    }

    function createInstance() {
        return {
            getSources,
            setSources
        }
    }

    return {
        getInstance() {
            return instance || (instance = createInstance());
        }
    }
})();