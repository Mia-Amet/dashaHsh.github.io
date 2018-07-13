const NewsStore = (function () {
    let news, instance;

    function getNews() {
        return news.slice();
    }

    function setNews(newsArray) {
        news = newsArray;
        return news.slice();
    }

    function createInstance() {
        return {
            getNews,
            setNews
        }
    }

    return {
        getInstance() {
            return instance || (instance = createInstance());
        }
    }
})();