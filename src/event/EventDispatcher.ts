class EventDispatcher {

    private __listeners: Object
    private __captureListeners: Object

    constructor() {
        this.__listeners = null
        this.__captureListeners = null
    }

    public addEventlistener(type: string, listener: Function, useCapture: boolean = true): void {
        let listeners: Object
        if (useCapture) {
            listeners = this.__captureListeners = this.__captureListeners || {}
        } else {
            listeners = this.__listeners = this.__listeners || {}
        }
        let listenerArray: Array<Function> = listeners[type]
        if (listenerArray) {
            this.removeEventListener(type, listener, useCapture)
        }
        listenerArray = listeners[type]
        if (!listenerArray) {
            listenerArray[type] = [listener]
        } else {
            listenerArray.push(listener)
        }
    }

    public removeEventListener(type: string, listener: Function, useCapture: boolean = true): void {
        let listeners: Object = useCapture ? this.__captureListeners : this.__listeners
        if (!listeners) return
        let listenersArray: Array<Function> = listeners[type]
        if (!listenersArray) return
        for (let i = 0, l = listenersArray.length; i < l; ++i) {
            if (listenersArray[i] === listener) {
                listenersArray.splice(i, 1)
                break
            }
        }
    }

    public removeAllEventListeners(type: string): void {
        if (!type) {
            this.__listeners = this.__captureListeners = null
        }
        if (this.__listeners) {
            delete this.__listeners[type]
        }
        if (this.__captureListeners) {
            delete this.__captureListeners[type]
        }
    }

    public dispatchEvent(event: string | Event): void {

    }
}

export default EventDispatcher