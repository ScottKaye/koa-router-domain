"use strict";

// Add dependencies
const Dependencies = {
	Koa: require("koa"),
	Router: require("koa-router"),
	Domain: require("./lib/koa-router-domain.js")
};

// Create app and some routers
const Koa = new Dependencies.Koa();
const MainRouter = new Dependencies.Router();
const APIRouter = new Dependencies.Router();
const SomeRouter = new Dependencies.Router();
const Domain = Dependencies.Domain;

// Nothing new here
Koa.use(MainRouter.routes());

// You can use array syntax:
Koa.use(new Domain([":type", ":version", "api"], APIRouter));

// Or string syntax, which is internally split into parts
Koa.use(new Domain(":sub.random", SomeRouter));

MainRouter.get("/:main", async (ctx, next) => {
	ctx.body = "This is the main site.";
	await next();
});

APIRouter.get("/:api", async (ctx, next) => {
	ctx.body = {
		message: "Welcome to the API!",
		type: APIRouter.vars.type,
		version: APIRouter.vars.version
	};
	await next();
});

SomeRouter.get("/:somerouter", async (ctx, next) => {
	ctx.body = `This is SomeRouter, on "${ SomeRouter.vars.sub }".`;
	await next();
});

Koa.listen(3000, () => {
	console.log("Listening on port 3000.");
});