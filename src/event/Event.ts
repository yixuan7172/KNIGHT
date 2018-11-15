class Event {
    public type: string
    public bubbles: boolean
    public cancelable: boolean
    public target: any
    public currentTarget: any
    public eventPhase: number
    public timeStamp: any
    public defaultPrevented: boolean
    public propagationStopped: boolean
    public removed: boolean

    constructor(type: string, bubbles: boolean, cancelable: boolean) {
        this.type = type
        this.bubbles = !!bubbles
        this.cancelable = !!cancelable
        this.target = null
        this.currentTarget = null
        this.eventPhase = 0
        this.timeStamp = (new Date).getTime()
        this.defaultPrevented = false
        this.propagationStopped = false
        this.removed = false
    }
}

export default Event