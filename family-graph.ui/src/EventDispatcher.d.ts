/**
 * Event handler that can subscribe to a dispatcher.
 */
export declare type EventHandler<E> = (event: E) => void;
/**
 * Event that can be subscribed to.
 */
export interface Event<E> {
    /**
     * Register a new handler with the dispatcher. Any time the event is
     * dispatched, the handler will be notified.
     * @param handler The handler to register.
     */
    register(handler: EventHandler<E>): void;
    /**
     * Desubscribe a handler from the dispatcher.
     * @param handler The handler to remove.
     */
    unregister(handler: EventHandler<E>): void;
}
export declare class EventDispatcher<E> implements Event<E> {
    /**
     * The handlers that want to be notified when an event occurs.
     */
    private _handlers;
    /**
     * Create a new event dispatcher.
     */
    constructor();
    /**
    * Register a new handler with the dispatcher. Any time the event is
    * dispatched, the handler will be notified.
    * @param handler The handler to register.
    */
    register(handler: EventHandler<E>): void;
    /**
     * Desubscribe a handler from the dispatcher.
     * @param handler The handler to remove.
     */
    unregister(handler: EventHandler<E>): void;
    /**
     * Dispatch an event to all the subscribers.
     * @param event The data of the event that occured.
     */
    dispatch(event: E): void;
}
