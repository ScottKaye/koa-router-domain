"use strict";

const Tools = require("./tools.js");

class Domain {
	constructor(domain, router) {
		// Force domain expression to array syntax
		if (!(domain instanceof Array)) {
			domain = domain.split(".");
		}

		// Check if expression has already been registered
		let genericDomain = Tools.genericificate(domain);
		Domain.prototype.validate(genericDomain, domain);

		// Per-request handler
		return async (ctx, next) => {
			// If the request matches this expression, dispatch the associated router
			if (Tools.resolve(domain, ctx, router)) {
				let dispatch = Tools.dispatcher;
				dispatch.router = router;
				await dispatch(ctx, router);
			}
			else {
				await next();
			}
		};
	};
};

Domain.prototype.registered = [];

// If a variable domain is registered that will be confused with another, throw a compile-time (interpret-time?) error
// A current limitation here is it can't tell the difference between "?" and "?.example.com"
Domain.prototype.validate = (genericDomain, realDomain) => {
	// Cannot already exist
	if (Domain.prototype.registered.includes(genericDomain)) {
		throw `Domain resembling "${ genericDomain }" is already registered.  Domain parts in question are "${ realDomain.join(".") }".`;
	}

	// Cannot end with a variable
	if (genericDomain.slice(-1) === "?") {
		throw `Domains cannot end with a variable.  Domain parts in question are "${ realDomain.join(".") }".`;
	}

	Domain.prototype.registered.push(genericDomain);
};

module.exports = Domain;