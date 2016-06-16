class Observable {

    set observer(observer) {
        this._observer = observer;
        this.time = new Orb.Time(observer.datetime);
    }

    get observer() {
        return this._observer;
    }

}