#!/usr/bin/env node
'use strict'
const fs = require('fs')
const cli = (async _ => {
	try {
		const [,, ...args] = process.argv
		const thrower = err => { switch(err) {
			case 0: throw new Error(`The xComponent creation script expects 1 argument which is the pathname of your component`)
			case 1: throw new Error(`The pathname argument must be relatif`)
			case 2: throw new Error(`Can't resolve the path of creation, "${path.join('/')}" does not exist`)
			case 3: throw new Error(`A file with name "${name}.js" already exist in ${path.join('/')}`)
		}}
		if (args.length == 0) thrower(0)
		if (args[0].startsWith('/')) thrower(1)
		let path = args[0].split('/')
		let name = path.pop()
		if (!fs.existsSync(path.join('/'))) thrower(2)
		if (fs.existsSync(`${args[0]}.js`)) thrower(3)
		let sample = fs.readFileSync(`${__dirname}/src/sample.js`, 'utf8').replace('xSample', name)
		fs.writeFileSync(`${args[0]}.js`, sample, 'utf8')
		console.log(`The xComponent with name ${name} has created successfully.`)
	} catch(e) { console.error(e) }
})()

