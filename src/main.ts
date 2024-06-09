import { RAFScheduler } from "./library/RAFScheduler.ts"

/**
 * The App class initializes the RAFScheduler and sets up various tasks.
 */
class App {

	scheduler: RAFScheduler

	/**
	 * Constructs the App instance, initializes the scheduler, and sets up tasks.
	 */
	constructor() {

		this.scheduler = new RAFScheduler()
		this.setup()
	}

	/**
	 * Starts executing the scheduled tasks.
	 */
	run() {

		this.scheduler.exec()
	}

	/**
	 * Sets up the tasks for the scheduler.
	 * - Schedules the update method to run at regular intervals.
	 * - Locks the update method after 5 seconds.
	 * - Unlocks the update method after 10 seconds.
	 * - Cancels the update method and clears the console after 15 seconds.
	 */
	private setup() {

		// Schedule the update method to run at regular intervals
		this.scheduler.interval( this.update )

		// Lock the update method after 5 seconds
		this.scheduler.timeout( () => this.scheduler.lock( this.update ), 5_000 )

		// Unlock the update method after 10 seconds
		this.scheduler.timeout( () => this.scheduler.unlock( this.update ), 10_000 )

		// Cancel the update method and clear the console after 15 seconds
		this.scheduler.timeout( () => {

			this.scheduler.cancel( this.update )
			console.clear()

		}, 15_000 )
	}

	/**
	 * The update method logs "updating..." along with the elapsed time in seconds.
	 * @param {Object} param - The parameter object.
	 * @param {number} param.elapsed - The elapsed time in seconds.
	 */
	private update( { elapsed }: { elapsed: number } ) {

		console.log( "updating...", elapsed )
	}
}

// Create a new App instance and start executing tasks
const app = new App()
app.run()
