class Store {
    getFavourites() {
        let favourites = !localStorage.getItem('favourites') ? [] : JSON.parse(localStorage.getItem('favourites'));
        return favourites.sort((a, b) => a.name - b.name);
    }

    addFavourite(name, value) {
        let favourites = this.getFavourites();

        if (favourites.every(item => item.name !== name)) {
            favourites.push({name, value});
        }

        localStorage.setItem('favourites', JSON.stringify(favourites));
    }

    removeFavourite(value) {
        const favourites = this.getFavourites();

        if (favourites.some(item => item.value === value)) {
            const list = favourites.filter(item => item.value !== value);
            localStorage.setItem('favourites', JSON.stringify(list));
        }
    }
}