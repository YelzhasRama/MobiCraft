import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ExceptionType } from 'src/common/responses/exception.response';

export const ApiNotFoundExceptionResponse = ({
  description = 'Exception indicated that some resource was not found',
  message,
}: {
  description?: string;
  message: string | string[];
}) => {
  const container = {} as { example?: any; examples?: any };

  if (typeof message === 'string') {
    container.example = {
      statusCode: HttpStatus.NOT_FOUND,
      message: message,
    };
  } else if (Array.isArray(message)) {
    container.examples = {};
    message.forEach((message, index) => {
      container.examples[index + 1] = {
        value: {
          statusCode: HttpStatus.NOT_FOUND,
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
