import AuthorizationClient from '../es-modules/rainbow-industries/rainbow-authorization-client/1.x/AuthorizationClient.js';


export default class AuthorizationMiddleware {



    constructor({
        host,
        serviceName,
    }) {
        this.host = host;
        this.serviceName = serviceName;

        this.authorizationClient = new AuthorizationClient({
            host,
            serviceName,
        });
    }




    /**
     * requires all requests to be properly authenticated
     *
     * @param      {object}   request  The request
     */
    async handleRequest(request) {
        if (!request.hasParameter('controller') || !request.hasParameter('action')) {
            return request.response()
                .status(500)
                .send({
                    status: 500,
                    message: `Failed to execute authorization, invalid controller and or action parameters!`,
                })
        }

        const controller = request.getParameter('controller');
        const action = request.getParameter('action');
        const tokens = [];


        if (request.hasHeader('authorization')) {
            const headerValue = request.getHeader('authorization');

            if (!Array.isArray(headerValue)) {
                headerValue = [headerValue];
            }

            for (const value of headerValue) {
                const result = /^rainbow (?<token>[a-z0-9]+)$/gi.exec(value);

                if (result && result.groups && result.groups.token) {
                    tokens.push(result.groups.token);
                } 
            }
        }
        

        // check the authorization
        const context = await this.authorizationClient.getSecurityContext(tokens);


        if (!context.isActionAllowed(controller, action)) {
            return request.response()
                .status(401)
                .send({
                    status: 401,
                    message: `You are nto allowed to execute the '${action}' action on the '${controller}' controller of the service '${this.serviceName}'!`
                })
        }


        request.setParameter('securityContext', context);
    }
}