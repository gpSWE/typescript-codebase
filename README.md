
# TypeScript Codebase for Modular Applications

This codebase primarily consists of high-performance, reusable modules for building web applications in TypeScript. All modules are well-documented, thoroughly tested, and optimized for performance, providing a robust foundation for efficient and effective application development.

## Modules

The repository includes several modules, each designed to address specific needs within a TypeScript application. Some of the key modules are:

- **[RAFScheduler](src/library/RAFScheduler.ts):** A class for scheduling tasks to be executed at specific intervals or after a delay using the requestAnimationFrame API. It supports locking and unlocking tasks, and ensures tasks are only executed after the scheduler is explicitly started. [Example](src/examples/RAFScheduler.md)
- **[EventDispatcher](src/library/EventDispatcher.ts):** A class that manages custom events, allowing you to register, trigger, lock, unlock, and cancel event listeners. It supports one-time and recurring event listeners. [Example](src/examples/EventDispatcher.md)
- **[Logger](src/library/Logger.ts):** A class for logging messages with different levels (debug, info, warn, error). It can handle multiple messages and formats Error objects to log their messages. [Example](src/examples/Logger.md)
