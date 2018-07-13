class DataBase {
    constructor(name) {
        this.db = FirestoreInit.getInstance().getDb();
        this.collectionName = name;
    }

    getCollection() {
        return new Promise((resolve, reject) => {
            this.db.collection(this.collectionName).get()
                .then(querySnapshot => resolve(querySnapshot))
                .catch(err => reject(err));
        })
    }

    addToCollection(item) {
        return new Promise((resolve, reject) => {
            this.db.collection(this.collectionName).add(item)
                .then(docRef => resolve(docRef))
                .catch(err => reject(err));
        })
    }

    deleteFromCollection(docId) {
        return new Promise((resolve, reject) => {
            this.db.collection(this.collectionName).doc(docId).delete()
                .then(res => resolve(res))
                .catch(err => reject(err));
        })
    }

    queryDocument(key, value) {
        return new Promise((resolve, reject) => {
            this.db.collection(this.collectionName).where(key, "==", value).get()
                .then(querySnapshot => resolve(querySnapshot))
                .catch(err => reject(err));
        })
    }
}

