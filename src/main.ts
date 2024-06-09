import { Logger, LogLevel } from "./library/Logger"

const logger = new Logger( LogLevel.DEBUG, {
    [ LogLevel.DEBUG ]: { color: "white", backgroundColor: "black", padding: "2px 8px", borderRadius: "2px" },
    [ LogLevel.INFO ]: { color: "black", backgroundColor: "lightblue", padding: "2px 8px", borderRadius: "2px" },
    [ LogLevel.WARN ]: { color: "black", backgroundColor: "yellow", padding: "2px 8px", borderRadius: "2px" },
    [ LogLevel.ERROR ]: { color: "black", backgroundColor: "red", padding: "2px 8px", borderRadius: "2px" }
} )

logger.debug( "This is a debug message." )
logger.info( "This is an info message." )
logger.warn( "This is a warning message." )
logger.error( "This is an error message." )
