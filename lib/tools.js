"use strict";

module.exports = class Tools {
	static solveUrl(route, request) {
		let vars = {};
		let match = true;

		// Attempt to fill in route variables with request
		for (let i = 0; i < route.length; ++i) {
			let rt = route[i];
			let rq = request[i];

			// Variables start with :
			if (rt[0] === ":") {
				vars[rt.slice(1)] = rq;
			}
			else if (rq !== rt) {
				match = false;
				break;
			}
		}

		return [vars, match];
	};

	static resolve(domain, ctx, router) {
		let host = Tools.getHostName(ctx).split(".");
		let [vars, match] = Tools.solveUrl(domain, host);

		if (match) {
			router.vars = vars;
		}

		return match;
	};

	static getHostName(ctx) {
		// Remove port number from entire host
		return ctx.request.header.host.replace(/:[0-9]+/, "");
	};

	static genericificate(domain) {
		// Return a string like beta.?.api where ? are variables
		// This helps to determine if a domain path has already been registered
		return domain.map(part => {
			if (part[0] === ":") return "?";
			return part.toLowerCase();
		}).join(".");
	};

	static dispatcher(ctx, router) {
		return router.routes()(ctx, null);
	};
};