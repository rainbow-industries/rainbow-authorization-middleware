import section from '../es-modules/distributed-systems/section-tests/1.x/index.js';
import HTTP2Client from '../es-modules/distributed-systems/http2-client/2.x/HTTP2Client.js';
import HTTP2Server from '../es-modules/distributed-systems/http2-server/2.x/HTTP2Server.js';
import AuthorizationMiddleware from '../AuthorizationMiddleware.js';
import assert from 'assert';


section('AuthorizationMiddleware', (section) => {
    section.test('load middleware', async () => {
        const middleware = new AuthorizationMiddleware({
            host: 'l.dns.porn',
            serviceName: 'test-service',
        });
    });


    section.test('invalid url', async () => {
        const middleware = new AuthorizationMiddleware({
            host: 'l.dns.porn',
            serviceName: 'test-service',
        });


        const server = new HTTP2Server({ secure: false });
        await server.load();
        await server.listen(7896);

        server.registerMiddleware(middleware);

        const client = new HTTP2Client();

        await client.get('http://l.dns.porn:7896').expect(500).send();
        await server.close();
    });


    section.test('valid url', async () => {
        const middleware = new AuthorizationMiddleware({
            host: 'l.dns.porn',
            serviceName: 'test-service',
        });


        const server = new HTTP2Server({ secure: false });
        await server.load();
        await server.listen(7896);

        server.registerMiddleware((request) => {
            request.setParameter('controller', 'test');
            request.setParameter('action', 'list');
        });

        server.registerMiddleware(middleware);

        const client = new HTTP2Client();

        await client.get('http://l.dns.porn:7896').expect(404).send();
        await server.close();
    });
});