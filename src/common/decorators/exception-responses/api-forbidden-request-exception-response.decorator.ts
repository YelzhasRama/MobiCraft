import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ExceptionType } from 'src/common/responses/exception.response';

export const ApiForbiddenRequestExceptionResponse = ({
  description = 'Exception indicated that endpoint is forbidden for provided credentials',
  message = 'Forbidden request',
}: {
  description?: string;
  message?: string | string[];
} = {}) => {
  const container = {} as { example?: any; examples?: any };

  if (typeof message === 'string') {
    container.example = {
      statusCode: HttpStatus.FORBIDDEN,
      message: message,
    };
  } else if (Array.isArray(message)) {
    container.examples = {};
    message.forEach((message, index) => {
      container.examples[index + 1] = {
        value: {
          statusCode: HttpStatus.FORBIDDEN,
          message,
        },
      };
    });
  }

  return applyDecorators(
    ApiExtraModels(ExceptionType),
    ApiNotFoundResponse({
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
