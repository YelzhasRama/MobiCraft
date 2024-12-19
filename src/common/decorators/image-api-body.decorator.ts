import { ApiBody } from '@nestjs/swagger';

export const ApiFileBody = () =>
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  });
