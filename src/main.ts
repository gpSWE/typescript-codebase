import { Logger, LogLevel } from "./library/Logger.ts"
import { EventDispatcher } from "./library/EventDispatcher.ts"

// Logger

const logger = new Logger( LogLevel.DEBUG, {
	[ LogLevel.DEBUG ]: { color: "white", backgroundColor: "black", padding: "2px 8px", borderRadius: "2px" },
	[ LogLevel.INFO ]: { color: "black", backgroundColor: "lightblue", padding: "2px 8px", borderRadius: "2px" },
	[ LogLevel.WARN ]: { color: "black", backgroundColor: "yellow", padding: "2px 8px", borderRadius: "2px" },
	[ LogLevel.ERROR ]: { color: "black", backgroundColor: "red", padding: "2px 8px", borderRadius: "2px" }
} )

// EventDispatcher

const dispatcher = new EventDispatcher()

// Register an event listener
dispatcher.on( "event1", ( event: CustomEvent ) => {

	logger.info( `event1 triggered: ${ event.detail[ 0 ].someData }` )
} )

dispatcher.exec( "event1", { someData: "example" } )

// Check if an event has listeners
logger.info( `has event1: ${ dispatcher.has( "event1" ) }` ) // true

// Lock an event callback
const callback = ( event: CustomEvent ) => {

	logger.info( `locked event: ${ event.detail[ 0 ].someData }` )
}
dispatcher.on( "event2", callback )
dispatcher.lock( "event2", callback )
dispatcher.exec( "event2", { someData: "example" } ) // callback will not be called

// Unlock an event callback
dispatcher.unlock( "event2", callback )
dispatcher.exec( "event2", { someData: "example" } ) // callback will be called

// Cancel an event callback
dispatcher.cancel( "event1" )
logger.info( `has event1: ${ dispatcher.has( "event1" ) }` ) // false

// Check if an event callback is locked
logger.info( `event2 is locked: ${ dispatcher.isLocked( "event2", callback ) }` ) // false

// Check how many times an event has been dispatched
logger.info( `count of dispatches (event1): ${ dispatcher.getDispatchCount( "event1" ) }` ) // 1
