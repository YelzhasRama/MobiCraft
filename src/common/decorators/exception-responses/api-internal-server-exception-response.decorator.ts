import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { ExceptionType } from 'src/common/responses/exception.response';

export const ApiInternalServerExceptionResponse = ({
  description = 'Error occurred while processing the request',
  message = 'InternalServerError',
}: {
  description?: string;
  message: string | string[];
}) => {
  const container = {} as { example?: any; examples?: any };

  if (typeof message === 'string') {
    container.example = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: message,
    };
  } else if (Array.isArray(message)) {
    container.examples = {};
    message.forEach((message, index) => {
      container.examples[index + 1] = {
        value: {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message,
        },
      };
    });
  }

  return applyDecorators(
    ApiExtraModels(ExceptionType),
    ApiInternalServerErrorResponse({
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
