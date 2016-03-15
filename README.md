# koa-router-domain
> Middleware to help route domains and subdomains to individual `koa-router`s.

koa-router-domain currently supports `koa@next` and `koa-router@next` (for `async` style).  Previous versions will not work!

# Usage
A full, complete example can be found in [example.js](example.js), but here's the basic idea:

```js
// Create app and some routers
const app = new Dependencies.Koa();
const MainRouter = new Dependencies.Router();
const APIRouter = new Dependencies.Router();
const Domain = Dependencies.Domain;

// Normal usage of routers still works
app.use(MainRouter.routes());

// Would match "beta.v2.api.example.com", "alpha.v6.api.domain.net", etc
// Would not match "beta.api.example.com"
app.use(new Domain(":type.:version.api", APIRouter));
```

Simply create a `new Domain({(String|Array)}, {router})`, and koa-router-domain will handle route matching and dispatches for you.  Since the first argument can be a `String` or `Array`, the following are identical:

```js
new Domain(":version.api", router);
new Domain([":version", "api"], router);
```

Because of the possibility of collisions (multiple routes matching the same request), koa-router-domain will do it's best to check if a similar route has been registered already when the server is started.  If a domain expression somehow matches multiple routes, the first one will be called.  **koa-router-domain does not `next()` through each match.**

# Domain Expressions
koa-router-domain supports variables in subdomains.  Variables start with `:`, and can contain anything, up to a period `.` to delimit subdomains.  Matched variables are exposed to router handlers through the use of `Router.vars` - [example.js](example.js) should make this very clear.

- Variables are not optional if they are specified in the domain expression
- Variables cannot be the last item in a domain expression, however.  If this needs to be the case (you want to use `v2.example.com` and `v6.domain.net` as variables), you can include the FQDN in the domain expression.
- Domain expressions are generalized internally to check if a similar route has been registered already.  This will fail if you include one route with a FQDN and another just as a subdomain list.  Whichever is added through `app.use` first will take precedence.