import fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { createUserRoute } from '../app/routes/create-user-route';
import { env } from '../env';
import { resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { fastifySwagger } from '@fastify/swagger';
import { sendMagicLinkRoute } from '../app/routes/send-magic-link-route';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'onec',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

app.register(createUserRoute);
app.register(sendMagicLinkRoute);

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('Http Server For Axon Running! 🚀');
  });

if (env.NODE_ENV === 'development') {
  const specFile = resolve(__dirname, '../../swagger.json');

  app.ready().then(() => {
    const spec = JSON.stringify(app.swagger(), null, 2);

    writeFile(specFile, spec).then(() => {
      console.log('Swagger spec generated!');
      console.log(uuidv4());
    });
  });
}
