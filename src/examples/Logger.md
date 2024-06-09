```TypeScript
import { Logger, LogLevel } from "./src/library/Logger.ts"

const logger = new Logger( LogLevel.DEBUG )
logger.debug( "Debug message 1", "Debug message 2" )
logger.info( "Info message 1", "Info message 2" )
logger.warn( "Warning message 1", "Warning message 2" )
logger.error( "Error message 1", "Error message 2" )
```
