```TypeScript
import { EventDispatcher } from "./library/EventDispatcher.ts"

// Create a new EventDispatcher instance
const dispatcher = new EventDispatcher()

// Add listeners for the "calc" event
dispatcher.on( "calc", square )
dispatcher.on( "calc", log )

// Emit the "calc" event every second with a random number between 0 and 99
setInterval( () => dispatcher.exec( "calc", Math.random() * 100 | 0 ), 1_000 )

// Lock the "square" callback for the "calc" event after 5 seconds
setTimeout( () => dispatcher.lock( "calc", square ), 5_000 )

// Lock all callbacks for the "calc" event after 10 seconds
setTimeout( () => dispatcher.lock( "calc" ), 10_000 )

// Callback functions

/**
 * Callback function to calculate and log the square of the event detail value
 * @param {CustomEvent} e - The event object
 */
function square( e: CustomEvent ) {

	console.log( "square", e.detail[ 0 ] * e.detail[ 0 ] )
}

/**
 * Callback function to calculate and log the natural logarithm of the event detail value
 * @param {CustomEvent} e - The event object
 */
function log( e: CustomEvent ) {

	console.log( "log", Math.log( e.detail[ 0 ] ) )
}
```
