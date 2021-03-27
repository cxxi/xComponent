'use strict'

import xComponent from './xComponent.js'

export default class xSample extends xComponent
{
	static options = {}

	get htmlAttributeA() { return this.getAttribute('htmlAttributeA') }
	set htmlAttributeA(v) { v
		? this.setAttribute('htmlAttributeA', v)
		: this.removeAttribute('htmlAttributeA')
		return true
	}

	constructor() { super('htmlAttributeA') }

	async init(localScope)
	{
		// CODE HERE
		return this
	}

	async render(x)
	{
		// CODE HERE
		return this
	}

	async behavior(Event)
	{
		// CODE HERE
		return this
	}
}

xSample.define()
