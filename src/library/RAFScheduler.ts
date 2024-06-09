/**
 * @module RAFScheduler
 * @description
 * The `RAFScheduler` class provides a simple and efficient way to schedule tasks to be executed at specific intervals or after a delay using the `requestAnimationFrame` API.
 * It allows you to lock and unlock tasks, and cancel them when needed. Each task receives an object with `delta` and `elapsed` properties indicating the time elapsed.
 *
 * @example
 * // Create a new RAFScheduler instance
 * const scheduler = new RAFScheduler()
 *
 * // Schedule a task to be executed after a 1-second delay
 * scheduler.timeout( ( { delta, elapsed }: { delta: number, elapsed: number } ) => {
 *     console.log( 'Task executed after timeout', delta, elapsed )
 * }, 1_000 )
 *
 * // Schedule a task to be executed at 1-second intervals
 * scheduler.interval( ( { delta, elapsed }: { delta: number, elapsed: number } ) => {
 *     console.log( 'Task executed at intervals', delta, elapsed )
 * }, 1_000 )
 *
 * // Schedule a task to be executed on every animation frame
 * scheduler.interval( ( { delta, elapsed }: { delta: number, elapsed: number } ) => {
 *     console.log( 'Task executed on every animation frame', delta, elapsed )
 * } )
 *
 * // Define a task that will be locked and unlocked
 * const task = ( { delta, elapsed }: { delta: number, elapsed: number } ) => {
 *     console.log( 'This task will be locked and not executed', delta, elapsed )
 * }
 *
 * // Schedule the task to be executed after a 1-second delay
 * scheduler.timeout( task, 1_000 )
 *
 * // Lock the task after 5 seconds
 * scheduler.timeout( () => {
 *     scheduler.lock( task )
 *     console.log( 'Task locked' )
 * }, 5_000 )
 *
 * // Unlock the task after 10 seconds
 * scheduler.timeout( () => {
 *     scheduler.unlock( task )
 *     console.log( 'Task unlocked' )
 * }, 10_000 )
 *
 * // Cancel the task after 15 seconds
 * scheduler.timeout( () => {
 *     scheduler.cancel( task )
 *     console.clear()
 * }, 15_000 )
 *
 * // Start executing scheduled tasks
 * scheduler.exec()
 *
 * // Check if the task is locked
 * console.log( scheduler.isLocked( task ) ) // false
 *
 * // Check if the task is already scheduled
 * console.log( scheduler.has( task ) ) // true
 */
export type Task = ( times: { delta: number, elapsed: number } ) => void

export class RAFScheduler {

    private _intervals: Map<Task, { duration: number, lastTime: number, startTime: number }>
    private _timeouts: Map<Task, { duration: number, startTime: number }>
    private _lockedCallbacks: Set<Task>
    private _running: boolean

    constructor() {

        // Initialize the internal data structures for managing intervals, timeouts, and locked callbacks
        this._intervals = new Map()
        this._timeouts = new Map()
        this._lockedCallbacks = new Set()
        this._running = false
    }

    /**
     * Schedules a task to be executed repeatedly at specified intervals.
     * If the duration is set to 0 or omitted, the task will be executed on every animation frame.
     * @param {Task} callback - The task to be executed.
     * @param {number} [duration=0] - The interval duration in milliseconds.
     */
    interval( callback: Task, duration: number = 0 ): void {

        // Store the task with its interval duration and initialize timing information
        this._intervals.set( callback, { duration, lastTime: 0, startTime: 0 } )
    }

    /**
     * Schedules a task to be executed after a specified delay.
     * @param {Task} callback - The task to be executed.
     * @param {number} duration - The delay duration in milliseconds.
     */
    timeout( callback: Task, duration: number ): void {

        // Store the task with its delay duration and initialize timing information
        this._timeouts.set( callback, { duration, startTime: 0 } )
    }

    /**
     * Cancels a scheduled task.
     * @param {Task} callback - The task to be canceled.
     */
    cancel( callback: Task ): void {

        // Remove the task from intervals, timeouts, and locked callbacks sets
        this._intervals.delete( callback )
        this._timeouts.delete( callback )
        this._lockedCallbacks.delete( callback )
    }

    /**
     * Locks a specific task, preventing it from being executed.
     * @param {Task} callback - The task to be locked.
     */
    lock( callback: Task ): void {

        // Add the task to the locked callbacks set
        this._lockedCallbacks.add( callback )
    }

    /**
     * Unlocks a specific task, allowing it to be executed.
     * @param {Task} callback - The task to be unlocked.
     */
    unlock( callback: Task ): void {

        // Remove the task from the locked callbacks set
        this._lockedCallbacks.delete( callback )
    }

    /**
     * Checks if a specific task is locked.
     * @param {Task} callback - The task to check.
     * @returns {boolean} True if the task is locked, otherwise false.
     */
    isLocked( callback: Task ): boolean {

        // Return whether the task is in the locked callbacks set
        return this._lockedCallbacks.has( callback )
    }

    /**
     * Checks if a specific task is already scheduled.
     * @param {Task} callback - The task to check.
     * @returns {boolean} True if the task is scheduled, otherwise false.
     */
    has( callback: Task ): boolean {

        // Return whether the task is in either the intervals or timeouts map
        return this._intervals.has( callback ) || this._timeouts.has( callback )
    }

    /**
     * Starts executing scheduled tasks.
     */
    exec(): void {

        // If the scheduler is already running, do nothing
        if ( this._running ) {

            return
        }

        // Mark the scheduler as running
        this._running = true

        // Initialize timing information and schedule each interval task
        this._intervals.forEach( ( task, callback ) => {

            task.lastTime = performance.now()
            task.startTime = task.lastTime

            this._scheduleInterval( callback )
        } )

        // Initialize timing information and schedule each timeout task
        this._timeouts.forEach( ( task, callback ) => {

            task.startTime = performance.now()

            this._scheduleTimeout( callback )
        } )
    }

    /**
     * Schedules the next execution of an interval task.
     * @private
     * @param {Task} callback - The task to be executed.
     */
    private _scheduleInterval( callback: Task ): void {

        const tick = () => {

            const task = this._intervals.get( callback )

            if ( !task ) {

                return
            }

            const now = performance.now()
            const delta = now - task.lastTime
            const elapsed = Math.floor( ( now - task.startTime ) / 1_000 )

            // If the task is not locked, execute it if the duration has passed
            if ( !this._lockedCallbacks.has( callback ) ) {

                if ( task.duration === 0 || delta >= task.duration ) {

                    callback( { delta, elapsed } )

                    task.lastTime = now
                }
            }

            // If the task is still scheduled, request the next animation frame
            if ( this._intervals.has( callback ) ) {

                requestAnimationFrame( tick )
            }
        }

        // Request the first animation frame
        requestAnimationFrame( tick )
    }

    /**
     * Schedules the next execution of a timeout task.
     * @private
     * @param {Task} callback - The task to be executed.
     */
    private _scheduleTimeout( callback: Task ): void {

        const tick = () => {

            const task = this._timeouts.get( callback )

            if ( !task ) {

                return
            }

            const now = performance.now()
            const delta = now - task.startTime
            const elapsed = Math.floor( ( now - task.startTime ) / 1_000 )

            // If the task is not locked, execute it if the duration has passed
            if ( !this._lockedCallbacks.has( callback ) ) {

                if ( delta >= task.duration ) {

                    callback( { delta, elapsed } )

                    this._timeouts.delete( callback )
                }
                else {

                    requestAnimationFrame(tick)
                }
            }
            else {
                requestAnimationFrame( tick )
            }
        }

        // Request the first animation frame
        requestAnimationFrame( tick )
    }
}

/**
 * Time Complexity Analysis:
 * - interval: O(1) - Adding to the intervals map.
 * - timeout: O(1) - Adding to the timeouts map.
 * - cancel: O(1) - Removing from the intervals or timeouts map.
 * - lock: O(1) - Adding to the locked callbacks set.
 * - unlock: O(1) - Removing from the locked callbacks set.
 * - isLocked: O(1) - Checking the locked callbacks set.
 * - has: O(1) - Checking the intervals and timeouts map.
 * - exec: O(n) - Iterating over all scheduled tasks.
 * 
 * Space Complexity Analysis:
 * - O(n) where n is the total number of scheduled tasks (intervals and timeouts).
 */
