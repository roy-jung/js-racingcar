import { Status, StateKeys } from '../types.js';
import worker from './worker.js';
export const initialState = {
    [StateKeys.cars]: [],
    [StateKeys.totalAttempts]: 0,
    [StateKeys.trial]: 0,
    [StateKeys.scores]: [],
    [StateKeys.processing]: false,
    [StateKeys.winners]: [],
    [StateKeys.status]: Status.idle,
};
export default class Store {
    #observers = new Set();
    #state;
    constructor(app, initialState) {
        this.#state = initialState;
        app.addEventListener('dispatch', ({ detail: { actionType, data } }) => {
            this.dispatch(actionType, data);
        });
    }
    dispatch(actionType, data = {}) {
        window.requestAnimationFrame(() => {
            console.info(`%c[[%c${actionType}%c]]`, 'color: #ee8', 'color: #8ee', 'color: #ee8', data);
            worker(actionType)(this, data);
        });
    }
    register(viewStore) {
        this.#observers.add(viewStore);
    }
    deregister(viewStore) {
        this.#observers.delete(viewStore);
    }
    notify() {
        window.requestAnimationFrame(() => {
            this.#observers.forEach((listener) => {
                listener.update(this.#state);
            });
        });
    }
    setValue(state) {
        window.requestAnimationFrame(() => {
            this.#state = { ...this.#state, ...state };
            this.notify();
        });
    }
    get(prop) {
        return this.#state[prop];
    }
}
export const connectStore = (() => {
    let closureStore;
    return (elem, state) => {
        if (elem && state)
            closureStore = new Store(elem, state);
        return closureStore;
    };
})();
//# sourceMappingURL=index.js.map