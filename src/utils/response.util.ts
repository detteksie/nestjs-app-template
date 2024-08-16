import { HttpException, Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

/* Success */

export class SuccessJson<T = any> {
  @ApiProperty()
  status: string;

  result: T;
}

export function successJson<T>(data: T): SuccessJson<T> {
  const resp = {
    status: 'success',
    result: data,
  };
  return resp;
}

export function ApiSuccessJson<TModel extends Type<unknown>>(
  model: TModel,
  isArr: boolean = false,
) {
  const schemaModel: SchemaObject | ReferenceObject = {
    $ref: getSchemaPath(model),
  };
  switch (model?.name) {
    case 'String':
      (schemaModel as SchemaObject).type = 'string';
      (schemaModel as ReferenceObject).$ref = undefined;
      break;
    case 'Number':
      (schemaModel as SchemaObject).type = 'number';
      (schemaModel as ReferenceObject).$ref = undefined;
      break;
    case 'Boolean':
      (schemaModel as SchemaObject).type = 'boolean';
      (schemaModel as ReferenceObject).$ref = undefined;
      break;
  }

  const result: SchemaObject | ReferenceObject = isArr
    ? { type: 'array', items: schemaModel }
    : schemaModel;

  return applyDecorators(
    ApiExtraModels(SuccessJson, model),
    ApiResponse({
      schema: {
        title: `SuccessOf${model?.name}`,
        allOf: [{ $ref: getSchemaPath(SuccessJson) }, { properties: { result } }],
      },
    }),
  );
}

/* Error */

export class ErrorJson<E extends Error> {
  @ApiProperty()
  status: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  stack: string;

  error: E;
}

export function errorJson<E extends Error>(exception: E): ErrorJson<E> {
  let stack = null;
  let error = null;
  let name = exception.name;

  if (process.env.NODE_ENV === 'development') {
    stack = exception.stack;
    error = exception;
  }

  if (exception instanceof HttpException) {
    const response = exception.getResponse() as object;
    name = response['error'];
  }

  const resp = {
    status: 'error',
    name,
    message: exception.message,
    stack,
    error,
  };
  return resp;
}

/* PaginatedDto */

class PaginatedLinks {
  @ApiProperty()
  first?: string;

  @ApiProperty()
  previous?: string;

  @ApiProperty()
  next?: string;

  @ApiProperty()
  last?: string;
}

class PaginatedMeta {
  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  totalItems?: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalPages?: number;

  @ApiProperty()
  currentPage: number;
}

class PaginatedDto<T = any> {
  @ApiProperty({ type: () => PaginatedLinks })
  links: PaginatedLinks;

  @ApiProperty({ type: () => PaginatedMeta })
  meta: PaginatedMeta;

  items: T[];
}

export const ApiPaginatedResponse = <TModel extends Type<unknown>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(SuccessJson, PaginatedDto),
    ApiExtraModels(PaginatedDto, model),
    ApiResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(SuccessJson) },
          {
            properties: {
              result: {
                title: PaginatedDto.name,
                allOf: [
                  { $ref: getSchemaPath(PaginatedDto) },
                  {
                    properties: {
                      items: {
                        type: 'array',
                        items: { $ref: getSchemaPath(model) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  );
};
