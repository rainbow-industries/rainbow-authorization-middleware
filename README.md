# Rainbow Authorization Middleware

Middleware doing all request authorization for the rainbow framework

The middleware expects two parameters set on the request, `controller` and ``action`. If those parameters are not set, the middleware will return the the status 500. 

Authentication tokens must be passed in the authorization header. The format is the following: `rainbow: HexEncodedToken` -> `rainbow: AF4162941629DDDECA5A5DDDEC41629DDDECA5A5A5A541629D41629DDDECA5A5`. Multiple headers may be sued for passing multiple tokens.

## API

```jaavascript
import AuthorizationMiddleware from '../es-moodules/rainbow-industries/rainbow-authorization-middleware/AuthorizationMiddleware.js';

const middleware = new AuthorizationMiddleware({
    host: 'l.dns.porn',
    serviceName: 'test-service'
});


http2Server.registerMiddleware(middleware);
```

### Class AuthorizationMiddleware

#### Constructor

the constructor expects two configuration parameters: the first is the host of the authorization server, the second is the name of the service to fetch permissions for.

```javascript
import AuthorizationClient from '../es-moodules/rainbow-industries/rainbow-authorization-client/AuthorizationClient.js';

const client = new AuthorizationClient({
    host: 'host.of.auth.server',
    serviceName: 'my-super-service',
});
```