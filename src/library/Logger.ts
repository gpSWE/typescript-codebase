/**
 * @module Logger
 * This module provides a Logger class to handle logging messages with different levels.
 * It supports customizable styles for each log level, including text color, background color,
 * padding, and border-radius. This allows for visually distinct log messages, aiding in
 * debugging and monitoring.
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
 * Type for log styles.
 * @typedef {object} LogStyle
 * @property {string} color - The text color.
 * @property {string} backgroundColor - The background color.
 * @property {string} padding - The padding around the log message.
 * @property {string} borderRadius - The border-radius around the log message.
 */
type LogStyle = {
	color?: string;
	backgroundColor?: string;
	padding?: string;
	borderRadius?: string;
}

/**
 * Class representing a logger.
 * This class provides methods for logging messages at various levels (debug, info, warn, error)
 * with customizable styles.
 * 
 * @example
 * const logger = new Logger( LogLevel.DEBUG, {
 *   [ LogLevel.DEBUG ]: { color: "blue", backgroundColor: "lightblue", padding: "2px", borderRadius: "4px" },
 *   [ LogLevel.INFO ]: { color: "green", backgroundColor: "lightgreen", padding: "2px", borderRadius: "4px" },
 *   [ LogLevel.WARN ]: { color: "orange", backgroundColor: "yellow", padding: "2px", borderRadius: "4px" },
 *   [ LogLevel.ERROR ]: { color: "red", backgroundColor: "lightcoral", padding: "2px", borderRadius: "4px" }
 * } )
 * logger.debug( "This is a debug message" )
 * logger.info( "This is an info message" )
 * logger.warn( "This is a warning message" )
 * logger.error( "This is an error message" )
 */
export class Logger {

	private level: LogLevel
	private styles: { [ key in LogLevel ]?: LogStyle }

	/**
	 * Create a logger.
	 * @param {LogLevel} level - The minimum log level for the logger.
	 * @param {object} [styles] - An optional object to specify styles (color, backgroundColor, padding, borderRadius) for log levels.
	 */
	constructor( level: LogLevel, styles?: { [ key in LogLevel ]?: LogStyle } ) {

		this.level = level
		this.styles = styles || {}
	}

	/**
	 * Log a debug message.
	 * @param {string} message - The message to log.
	 */
	debug( message: string ): void {

		if ( this.level <= LogLevel.DEBUG ) {

			this.logWithStyle( LogLevel.DEBUG, `DEBUG: ${ message }` )
		}
	}

	/**
	 * Log an info message.
	 * @param {string} message - The message to log.
	 */
	info( message: string ): void {

		if ( this.level <= LogLevel.INFO ) {

			this.logWithStyle( LogLevel.INFO, `INFO: ${ message }` )
		}
	}

	/**
	 * Log a warning message.
	 * @param {string} message - The message to log.
	 */
	warn( message: string ): void {

		if ( this.level <= LogLevel.WARN ) {

			this.logWithStyle( LogLevel.WARN, `WARN: ${ message }` )
		}
	}

	/**
	 * Log an error message.
	 * @param {string} message - The message to log.
	 */
	error( message: string ): void {

		if ( this.level <= LogLevel.ERROR ) {

			this.logWithStyle( LogLevel.ERROR, `ERROR: ${ message }` )
		}
	}

	/**
	 * Logs a message with the specified style if provided.
	 * @param {LogLevel} level - The log level.
	 * @param {string} message - The message to log.
	 * @private
	 */
	private logWithStyle( level: LogLevel, message: string ): void {

		const style = this.styles[ level ]

		if ( style ) {

			const color = style.color || "inherit"
			const backgroundColor = style.backgroundColor || "inherit"
			const padding = style.padding || "0"
			const borderRadius = style.borderRadius || "0"

			console.log(
				`%c${ message }`,
				`
				color: ${ color };
				background-color: ${ backgroundColor };
				padding: ${ padding };
				border-radius: ${ borderRadius }
				`
			)
		}
		else {
			console.log( message )
		}
	}
}
