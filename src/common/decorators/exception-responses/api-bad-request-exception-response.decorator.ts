import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { ExceptionType } from 'src/common/responses/exception.response';

export const ApiBadRequestExceptionResponse = ({
  description = 'Exception indicated that the request payload or parameters was not valid',
  message,
}: {
  description?: string;
  message: string | string[];
}) => {
  const container = {} as { example?: any; examples?: any };

  if (typeof message === 'string') {
    container.example = {
      statusCode: HttpStatus.BAD_REQUEST,
      message: message,
    };
  } else if (Array.isArray(message)) {
    container.examples = {};
    message.forEach((message, index) => {
      container.examples[index + 1] = {
        value: {
          statusCode: HttpStatus.BAD_REQUEST,
          message,
        },
      };
    });
  }

  return applyDecorators(
    ApiExtraModels(ExceptionType),
    ApiBadRequestResponse({
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
