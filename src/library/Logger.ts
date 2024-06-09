/**
 * @module Logger
 * This module provides a Logger class to handle logging messages with different levels.
 */

/**
 * Const enum for log levels.
 * @readonly
 * @enum {number}
 */
export const LogLevel = {
	DEBUG: 0,
	INFO: 1,
	WARN: 2,
	ERROR: 3,
}

type LogLevel = typeof LogLevel[ keyof typeof LogLevel ]

/**
 * Class representing a logger.
 * This class provides methods for logging messages at various levels (debug, info, warn, error).
 * 
 * @example
 * const logger = new Logger( LogLevel.DEBUG )
 * logger.debug( "Debug message 1", "Debug message 2" )
 * logger.info( "Info message 1", "Info message 2" )
 * logger.warn( "Warning message 1", "Warning message 2" )
 * logger.error( "Error message 1", "Error message 2" )
 */
export class Logger {

	private level: LogLevel

	/**
	 * Create a logger.
	 * @param {LogLevel} level - The minimum log level for the logger.
	 */
	constructor( level: LogLevel ) {

		this.level = level
	}

	/**
	 * Log one or more debug messages.
	 * @param {...any} messages - The messages to log.
	 */
	debug( ...messages: any[] ): void {

		if ( this.level <= LogLevel.DEBUG ) {

			// Process messages to handle Error instances
			const processedMessages = messages.map( msg => msg instanceof Error ? msg.message : msg )

			// Log the messages with the DEBUG prefix
			console.log( "DEBUG:", ...processedMessages )
		}
	}

	/**
	 * Log one or more info messages.
	 * @param {...any} messages - The messages to log.
	 */
	info( ...messages: any[] ): void {

		if ( this.level <= LogLevel.INFO ) {

			// Process messages to handle Error instances
			const processedMessages = messages.map( msg => msg instanceof Error ? msg.message : msg )

			// Log the messages with the INFO prefix
			console.log( "INFO:", ...processedMessages )
		}
	}

	/**
	 * Log one or more warning messages.
	 * @param {...any} messages - The messages to log.
	 */
	warn( ...messages: any[] ): void {

		if ( this.level <= LogLevel.WARN ) {

			// Process messages to handle Error instances
			const processedMessages = messages.map( msg => msg instanceof Error ? msg.message : msg )

			// Log the messages with the WARN prefix
			console.log( "WARN:", ...processedMessages )
		}
	}

	/**
	 * Log one or more error messages.
	 * @param {...any} messages - The messages to log.
	 */
	error( ...messages: any[] ): void {

		if ( this.level <= LogLevel.ERROR ) {

			// Process messages to handle Error instances
			const processedMessages = messages.map( msg => msg instanceof Error ? msg.message : msg )

			// Log the messages with the ERROR prefix
			console.log( "ERROR:", ...processedMessages )
		}
	}
}
