const logger = {
	log: (text: string | number, ...message: any) => {
		console.log(`\x1b[32m[ LOG ] \x1b[39m${text}`, message)
	},
	error: (text: string | number, ...message: any) => {
		console.log(`\x1b[31m[ ERROR ] \x1b[39m${text}`, message)
	},
	debug: (text: string | number, ...message: any) => {
		console.log(`\x1b[90m[ DEBUG ] ${text}`, message)
	},
	mysql: (text: string | number, ...message: any) => {
		console.log(`\x1b[5m\x1b[91m[ MYSQL ] \x1b[39m${text}`, message)
	},
}

export default logger