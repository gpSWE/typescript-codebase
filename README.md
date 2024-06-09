
# TypeScript Codebase for Modular Applications

Welcome to the TypeScript Codebase repository! This repository features a comprehensive collection of high-performance, reusable modules and design patterns. Designed to streamline development and optimize performance, these resources will help you build a wide range of applications efficiently and effectively using TypeScript.

## Table of Contents

- [Getting Started](#getting-started)
- [Modules](#modules)
- [Usage](#usage)

## Getting Started

To get started with this repository, follow these steps:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/gpSWE/typescript-codebase.git
   cd typescript-codebase
2. **Install dependencies:**
   ```sh
   pnpm install
3. **Run the tests:**
    ```sh
   pnpm run test

## Modules

The repository includes several modules, each designed to address specific needs within a TypeScript application. Some of the key modules are:

- **[Logger](src/library/Logger.ts):** A customizable logging utility that supports different log levels and styles.

## Usage

Here is an example of how to use the \`Logger\` module in your TypeScript project:

   ```TypeScript
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
