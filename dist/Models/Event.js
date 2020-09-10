"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const privateEvents = new WeakMap();
class Event {
    subscribe(func) {
        if (privateEvents.has(this)) {
            const events = privateEvents.get(this);
            events === null || events === void 0 ? void 0 : events.push(func);
            if (events) {
                privateEvents.set(this, events);
            }
        }
        else {
            privateEvents.set(this, [func]);
        }
    }
    unsubscribe(func) {
        if (privateEvents.has(this)) {
            const events = privateEvents.get(this);
            if (events) {
                const filteredArray = events.filter((f) => f !== func);
                privateEvents.set(this, filteredArray);
            }
        }
    }
    fire(item) {
        if (privateEvents.has(this)) {
            privateEvents.get(this).forEach((func) => {
                func(item);
            });
        }
    }
    clear() {
        if (privateEvents.has(this)) {
            privateEvents.delete(this);
        }
    }
}
exports.default = Event;
//# sourceMappingURL=Event.js.map