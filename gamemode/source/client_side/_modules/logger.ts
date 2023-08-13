const logger = {
	log: (text: string | number, save: boolean = false, server: boolean = false) => {
		if(!server) mp.console.logInfo(`[ LOG ] ${text}`, save, false)
		else mp.events.callRemote('server::logger:log', text)
	},
	console: (text: string | number, save: boolean = false) => {
		mp.console.logInfo(`[ CONSOLE ] ${text}`, save, false)
	},
	error: (text: string | number, save: boolean = true) => {
		mp.console.logError(`[ ERROR ] ${text}`, save, false)
	},
	fatal: (text: string | number, save: boolean = true) => {
		mp.console.logError(`[ FATAL ERROR ] ${text}`, save, false)
	},

}

export default logger