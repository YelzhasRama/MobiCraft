import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { ExceptionType } from 'src/common/responses/exception.response';

export const ApiConflictExceptionResponse = ({
  description = 'Exception indicated that there was a logical conflict during the request',
  message,
}: {
  description?: string;
  message: string | string[];
}) => {
  const container = {} as { example?: any; examples?: any };

  if (typeof message === 'string') {
    container.example = {
      statusCode: HttpStatus.CONFLICT,
      message: message,
    };
  } else if (Array.isArray(message)) {
    container.examples = {};
    message.forEach((message, index) => {
      container.examples[index + 1] = {
        value: {
          statusCode: HttpStatus.CONFLICT,
          message,
        },
      };
    });
  }

  return applyDecorators(
    ApiExtraModels(ExceptionType),
    ApiConflictResponse({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            description,
            $ref: getSchemaPath(ExceptionType),
          },
          ...container,
        },
      },
    }),
  );
};
