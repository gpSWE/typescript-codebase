/**
 * @module EventDispatcher
 * @description
 * The `EventDispatcher` class provides a simple and flexible way to manage custom events in JavaScript. 
 * It allows you to register event listeners, trigger events, and manage the lifecycle of event callbacks.
 * With this class, you can add listeners for one-time or recurring events, lock and unlock specific callbacks, 
 * and cancel event listeners as needed.
 *
 * This class is particularly useful for creating decoupled systems where different parts of an application 
 * can communicate through events without having direct references to each other.
 *
 * @example
 * // Create a new EventDispatcher instance
 * const dispatcher = new EventDispatcher()
 *
 * // Register an event listener
 * dispatcher.on( "event1", ( event: CustomEvent ) => {
 *     console.log( "event1 triggered", event.detail )
 * });
 *
 * // Trigger the event
 * dispatcher.exec( "event1", { someData: "example" } )
 *
 * // Check if an event has listeners
 * console.log( dispatcher.has( "event1" ) ) // true
 *
 * // Lock an event callback
 * const callback = ( event: CustomEvent ) => {
 *     console.log( "locked event", event.detail )
 * };
 * dispatcher.on( "event2", callback )
 * dispatcher.lock( "event2", callback )
 * dispatcher.exec( "event2", { someData: "example" } ) // callback will not be called
 *
 * // Unlock an event callback
 * dispatcher.unlock( "event2", callback )
 * dispatcher.exec( "event2", { someData: "example" } ) // callback will be called
 *
 * // Cancel an event callback
 * dispatcher.cancel( "event1" )
 * console.log(dispatcher.has( "event1" ) ) // false
 *
 * // Check if an event callback is locked
 * console.log( dispatcher.isLocked( "event2", callback ) ) // false
 *
 * // Check how many times an event has been dispatched
 * console.log( dispatcher.getDispatchCount( "event1" ) ) // 1
 */

export type EventCallback<T = any> = ( event: CustomEvent<T> ) => void

export class EventDispatcher {

	private _eventTarget: EventTarget
	private _lockedEvents: Map<string, Set<EventCallback>>
	private _onceCallbacks: Map<EventCallback, EventCallback>
	private _callbacks: Map<string, Set<EventCallback>>
	private _eventCounts: Map<string, number>

	constructor() {

		this._eventTarget = new EventTarget()
		this._lockedEvents = new Map()
		this._onceCallbacks = new Map()
		this._callbacks = new Map()
		this._eventCounts = new Map()
	}

	/**
	 * Registers an event listener.
	 * @param {string} type - The event type.
	 * @param {EventCallback} cb - The callback function to execute when the event is triggered.
	 */
	on<T = any>( type: string, cb: EventCallback<T> ): void {

		if ( !this._callbacks.has( type ) ) {

			this._callbacks.set( type, new Set() )
		}

		this._callbacks.get( type )!.add( cb )
		this._eventTarget.addEventListener( type, cb as EventListener )
	}

	/**
	 * Registers an event listener that is called only once.
	 * @param {string} type - The event type.
	 * @param {EventCallback} cb - The callback function to execute when the event is triggered.
	 */
	once<T = any>( type: string, cb: EventCallback<T> ): void {

		const onceWrapper = ( event: Event ) => {

			cb( event as CustomEvent<T> )

			this._eventTarget.removeEventListener( type, onceWrapper )
		}

		this._onceCallbacks.set( cb, onceWrapper as EventCallback )
		this._eventTarget.addEventListener( type, onceWrapper )
	}

	/**
	 * Triggers an event.
	 * @param {string} type - The event type.
	 * @param {...any} args - The arguments to pass to the event listeners.
	 */
	exec<T = any>( type: string, ...args: T[] ): void {

		if ( this._lockedEvents.has( type ) ) {

			const lockedCallbacks = this._lockedEvents.get( type )!
			const event = new CustomEvent( type, { detail: args } )

			for ( const callback of this._callbacks.get( type )! ) {

				if ( !lockedCallbacks.has( callback ) ) {

					callback( event )
				}
			}
		}
		else {

			const event = new CustomEvent( type, { detail: args } )
			this._eventTarget.dispatchEvent( event )
		}

		// Increment the event count
		if ( this._eventCounts.has( type ) ) {

			this._eventCounts.set( type, this._eventCounts.get( type )! + 1 )
		}
		else {

			this._eventCounts.set( type, 1 )
		}
	}

	/**
	 * Locks a specific event callback or all callbacks of an event type.
	 * @param {string} type - The event type.
	 * @param {EventCallback|null} [cb=null] - The callback function to lock. If null, all callbacks for the event type are locked.
	 */
	lock( type: string, cb: EventCallback | null = null ): void {

		if ( !this._lockedEvents.has( type ) ) {

			this._lockedEvents.set( type, new Set() )
		}

		if ( cb ) {

			this._lockedEvents.get( type )!.add( cb )
		}
		else {

			for ( const callback of this._callbacks.get( type )! ) {

				this._lockedEvents.get( type )!.add( callback )
			}
		}
	}

	/**
	 * Unlocks a specific event callback or all callbacks of an event type.
	 * @param {string} type - The event type.
	 * @param {EventCallback|null} [cb=null] - The callback function to unlock. If null, all callbacks for the event type are unlocked.
	 */
	unlock( type: string, cb: EventCallback | null = null ): void {

		if ( this._lockedEvents.has( type ) ) {

			if ( cb ) {

				this._lockedEvents.get( type )!.delete( cb )

				if ( this._lockedEvents.get( type )!.size === 0 ) {

					this._lockedEvents.delete( type )
				}
			}
			else {

				this._lockedEvents.delete( type )
			}
		}
	}

	/**
	 * Cancels a specific event callback or all callbacks of an event type.
	 * @param {string} type - The event type.
	 * @param {EventCallback|null} [cb=null] - The callback function to cancel. If null, all callbacks for the event type are cancelled.
	 */
	cancel( type: string, cb: EventCallback | null = null ): void {

		if ( cb ) {

			this._eventTarget.removeEventListener( type, cb as EventListener )

			if ( this._callbacks.has( type ) ) {

				this._callbacks.get( type )!.delete( cb )
			}

			if ( this._onceCallbacks.has( cb ) ) {

				this._eventTarget.removeEventListener( type, this._onceCallbacks.get( cb )! as EventListener )
				this._onceCallbacks.delete( cb )
			}
		}
		else {

			if ( this._callbacks.has( type ) ) {

				for ( const callback of this._callbacks.get( type )! ) {

					this._eventTarget.removeEventListener( type, callback as EventListener )
				}

				this._callbacks.delete( type )
			}
		}
	}

	/**
	 * Checks if there are any callbacks registered for an event type or a specific callback.
	 * @param {string} type - The event type.
	 * @param {EventCallback|null} [cb=null] - The callback function to check. If null, checks if any callbacks for the event type are registered.
	 * @returns {boolean} True if the callback or any callback for the event type is registered, otherwise false.
	 */
	has( type: string, cb: EventCallback | null = null ): boolean {

		if ( cb ) {

			return this._callbacks.has( type ) && this._callbacks.get( type )!.has( cb )
		}
		else {

			return this._callbacks.has( type ) && this._callbacks.get( type )!.size > 0
		}
	}

	/**
	 * Checks how many times an event has been dispatched or a specific callback has been invoked.
	 * @param {string} type - The event type.
	 * @param {EventCallback|null} [cb=null] - The callback function to check. If null, checks the dispatch count for the event type.
	 * @returns {number} The number of times the event has been dispatched or the callback has been invoked.
	 */
	getDispatchCount( type: string, cb: EventCallback | null = null ): number {

		if ( cb ) {

			let count = 0

			if ( this._eventCounts.has( type ) ) {

				const callbacks = this._callbacks.get( type )

				if ( callbacks && callbacks.has( cb ) ) {

					count += this._eventCounts.get( type )!
				}
			}

			return count
		}
		else {

			return this._eventCounts.get( type ) || 0
		}
	}

	/**
	 * Checks if a specific event callback or an entire event type is locked.
	 * @param {string} type - The event type.
	 * @param {EventCallback|null} [cb=null] - The callback function to check. If null, checks if any callbacks for the event type are locked.
	 * @returns {boolean} True if the callback or any callback for the event type is locked, otherwise false.
	 */
	isLocked( type: string, cb: EventCallback | null = null ): boolean {

		if ( !this._lockedEvents.has( type ) ) {

			return false
		}

		if ( cb ) {

			return this._lockedEvents.get( type )!.has( cb )
		}
		else {

			return this._lockedEvents.get( type )!.size > 0
		}
	}
}

/* 
 * Time Complexity Analysis:
 * - on: O(1)
 * - once: O(1)
 * - exec: O(n) where n is the number of callbacks for the event type
 * - lock: O(n) for locking all callbacks of an event type, O(1) for specific callback
 * - unlock: O(1)
 * - isLocked: O(1)
 * - cancel: O(n) for all callbacks of an event type, O(1) for specific callback
 * - has: O(1)
 * - getDispatchCount: O(1) for event type, O(n) for specific callback
 * 
 * Space Complexity Analysis:
 * - O(n) where n is the total number of callbacks across all event types
 */
