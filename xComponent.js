'use strict'

export default class xComponent extends HTMLElement
{
	get attributes()
	{
		return this.hasAttribute('attributes') 
			? this.getAttribute('attributes') 
			: null
	}

	set attributes(v)
	{
		this.v = v
		return true
	}

	static get observedAttributes()
	{
	    return this.attributes
	}

	static get keyLifeCycle()
	{
		return ['down', 'init', 'render', 'behavior', 'up']
	}

	static define()
	{
		if (!(new RegExp(/^x[A-Z][a-z]+$/)).test(this.name)) {
			throw new TypeError(`Incorrect syntax for name of component "${this.name}"`)
		}

		if (window.customElements.get(xComponent._getTag(this.name)) === undefined) {
			customElements.define(xComponent._getTag(this.name), this)
		}

		return true
	}

	static _getTag(cls)
	{
		return `x-${cls.slice(1).toLowerCase()}`
	}

	constructor(...observedAttrs)
	{
		super()

		this._isAncestor()
		this.attributes = observedAttrs

		this.inner = this._buildInner(this.innerHTML.trim())		
		this.vDom  = this.xRef = null

		this._configure()

		const reflect   = Reflect.getPrototypeOf(this)
		this.methods    = Reflect.ownKeys(reflect).filter(m => m !== 'constructor')
		this.name       = reflect.constructor.names

		this.lifeCycle  = 'down'

		if (this._debug()) {
			let log = `${this.constructor.name} has been successfully instantiated`
			if (this._debug(true)) log += `\noptions: ${JSON.stringify(this.options, null, 2)}`
			console.log(log)
		}
	}

	async connectedCallback()
	{
		await this._runLifeCycle()
	}

	async disconnectedCallback()
	{
		for (const [k, v] of Object.entries(window.xInstances))
		{
			v == this ? delete window.xInstances[k] : null
		}
	}

	async callLifeCycle(lifeCycle)
	{
		await this._runLifeCycle(lifeCycle)
	}

	async waitLifeCycle(component, lifeCycle)
	{
		return new Promise((resolve, reject) => { let waiter = setInterval( _ => {
			if (this._debug()) console.log(component.lifeCycle)
			if (keyLifeCycle.indexOf(component.lifeCycle) >= keyLifeCycle.indexOf(lifeCycle)) {
				resolve(clearInterval(waiter))
			}
		}, 100) })
	}

	async waitPropValue(prop, value = false)
	{
		return new Promise((resolve, reject) => { let waiter = setInterval( _ => {
			if (!value) {
				if (this[prop] != null && this[prop] != undefined && this[prop] != false && this[prop].length > 0) {
					resolve(clearInterval(waiter))
				}
			} else { this[prop] == value ? resolve(clearInterval(waiter)) : null }
		}, 100) })
	}

	clear()
	{
		while (this.firstChild) 
		{
			this.lastChild.remove()
		}
		return this
	}

	_isAncestor()
	{
		if (this.constructor.name === xComponent.constructor.name) {
			throw new TypeError(`xComponent cannot be instantiated directly`)
		}
	}

	_configure()
	{ 
		this.options = Object.assign({
			sharedScope: true,
			persist: false,
			keepRef: false,
			debug: false
		}, this.constructor.options)

		if (this.hasAttribute('x-ref')) {

			if (!window.xInstances) {
				window.xInstances = {}
				window.xGet = (key = false) => key ? window.xInstances[key] : window.xInstances
			}

			this.xRef = this.getAttribute('x-ref')
			window.xInstances[this.xRef] = this
			if (!this.options.keepRef) {
				this.removeAttribute('x-ref')
			}
		}
	}

	_buildInner(str)
	{
		const template = document.createElement('template')
	    template.innerHTML = str
	    return Array.from(template.content.childNodes).map(node => {
	    	return node.nodeType === 3 ? node.textContent.trim() : node
	    })
	}

	_debug(isHard = false)
	{
		return isHard ? this.options.debug == 'hard' : this.options.debug
	}

	async _runLifeCycle(since = 'down')
	{
		try
		{
			const step = xComponent.keyLifeCycle.indexOf(since)
			const componentlifeCycle = _lifeCycle(this)

			function* _lifeCycle(component)
			{
				yield //----------------------------(xComponent.keyLifeCycle[0])-------
				yield step <= 1 ? component._runStep(xComponent.keyLifeCycle[1]) : false
				yield step <= 2 ? component._runStep(xComponent.keyLifeCycle[2]) : false
				yield step <= 3 ? component._runStep(xComponent.keyLifeCycle[3]) : false
				// ---------------------------------(xComponent.keyLifeCycle[4])-------
			}

			let lifeCycle = componentlifeCycle.next()

			while (!lifeCycle.done)
			{
				lifeCycle = componentlifeCycle.next()
				if (lifeCycle.value) {
					const c = await lifeCycle.value
					!lifeCycle.done
						? c[1].lifeCycle = c[0]
						: this.lifeCycle = 'up'
				}
			}
		}

		catch(error) { console.log(error) }
	}

	_runStep(lifeCycle)
	{
		let args = []

		switch(lifeCycle)
		{
			case 'init':
			{
				const localScope = { baseHtml: this.inner/* include some usefull data/methods */ }

				if (this.options.sharedScope) {

					if (window.Scope) window.Scope = Object.assign({}, window.Scope, localScope)
					else {

						class xScope {
							constructor(state) { 
								const scope = {}
								this.safe = new WeakMap()
								this.safe.set(scope, state)
							    this.get = (keyName = false) => {
							    	if (!keyName) return this.safe.get(scope)
									return Object.entries(this.safe.get(scope)).filter(f => f[0] == keyName)[0]
							    }
							    this.set = (keyName, value) => {
							    	if (!keyName || !value) return false
							    	this.safe.set(scope, Object.assign({}, this.safe.get(scope), {[keyName]: value}))
							    	return true
							    }
							}
						}

						window.Scope = new xScope()
					}
				}

				// myNameSpace = function(){
				//   var current = null
				//   function init(){}
				//   function change(){}
				//   function verify(){}
				//   return{
				//     init:init,
				//     set:change
				//   }
				// }()
				// console.log(myNameSpace.set('ok'))

				args.push(localScope)
				break
			}

			case 'render':
			{
				this.options.persist ? this.innerHTML = this.inner : this.clear()

				const xRender = (tag, attrs = {}, children = []) => {
					const isTag = v => {
						try { return document.createElement(v).toString() !== "[object HTMLUnknownElement]" }
						catch { return false }
					}
					const renderEl = (t, a, c) => {
						if (t.constructor.name.startsWith('HTML')) return t
						if (!isTag(t)) return document.createTextNode(t)
						let el = document.createElement(t)
						for (const [k, v] of Object.entries(a)) el.setAttribute(k, v)
						c = Array.isArray(c) ? c : [c]
						for (const child of c) el.appendChild(renderEl(child))
						return el
					}
					this.vDom = renderEl(tag, attrs, children)
					return this.vDom
				}

				args.push(xRender)
				break
			}
 
			case 'behavior':
			{
				class xEvent {
					constructor(eventType, selector, callback) {	
						document.querySelectorAll(selector).forEach(el => {
							el.addEventListener(eventType, callback)
						})
					}
				}

				args.push(xEvent)
				break
			}
		}

		return new Promise((resolve, reject) => {
			// this['pre'+lifeCycle](...args)
			this[lifeCycle](...args).then(res => {
				// this['post'+lifeCycle](res)
				if (lifeCycle == 'render') {
					this.replaceWith(this.vDom)
				}
				resolve([lifeCycle, res])
			})
		})
	}

	// postInit(a) { console.log('post init', a) }
	// postRender(a) { console.log('post render', a) }
	// postBehavior(a) { console.log('post behavior', a) }
	// preInit(a) { console.log('pre init', a) }
	// preRender(a) { console.log('pre render', a) }
	// preBehavior(a) { console.log('pre behavior', a) }
}