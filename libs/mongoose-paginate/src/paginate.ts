/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';

import { createPaginationObject } from './create-pagination';
import {
  IPaginationMeta,
  IPaginationOptions,
  ObjectLiteral,
  // TypeORMCacheType
} from './interfaces';

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export async function mongoosePaginate<T, CustomMetaType extends ObjectLiteral = IPaginationMeta>(
  query: mongoose.Query<T[], T>,
  options: IPaginationOptions<CustomMetaType>,
) {
  // const [page, limit, route, countQueries, cacheOption] = resolveOptions(options);
  const [page, limit, route, countQueries] = resolveOptions(options);

  const promises: [Promise<T[]>, Promise<number> | undefined] = [
    query
      .clone()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec(),
    undefined,
  ];
  if (countQueries) {
    promises[1] = query.clone().countDocuments();
  }

  const [items, total] = await Promise.all(promises);

  return createPaginationObject<T, CustomMetaType>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
    route,
    metaTransformer: options.metaTransformer,
    routingLabels: options.routingLabels,
  });
}

function resolveOptions(
  options: IPaginationOptions<any>,
  // ): [number, number, string, boolean, TypeORMCacheType] {
): [number, number, string, boolean] {
  const page = resolveNumericOption(options, 'page', DEFAULT_PAGE);
  const limit = resolveNumericOption(options, 'limit', DEFAULT_LIMIT);
  const route = options.route;
  const countQueries = typeof options.countQueries !== 'undefined' ? options.countQueries : true;
  // const cacheQueries = options.cacheQueries || false;

  // return [page, limit, route, countQueries, cacheQueries];
  return [page, limit, route, countQueries];
}

function resolveNumericOption(
  options: IPaginationOptions,
  key: 'page' | 'limit',
  defaultValue: number,
): number {
  const value = options[key];
  const resolvedValue = Number(value);

  if (Number.isInteger(resolvedValue) && resolvedValue >= 0) return resolvedValue;

  console.warn(
    `Query parameter "${key}" with value "${value}" was resolved as "${resolvedValue}", please validate your query input! Falling back to default "${defaultValue}".`,
  );
  return defaultValue;
}
