import {
  type AllOperations,
  type ApiClientRequestOptions,
  type FetchResponseBody,
  type ResponseWithType,
  type ReturnData,
} from '@shopify/admin-api-client';

const API_VERSION = '2025-10';

declare module '@shopify/admin-api-client' {
  interface AllOperations extends AdminQueries, AdminMutations {}
}

export async function graphql<
  Operation extends keyof Operations,
  Operations extends AllOperations,
>(
  query: Operation,
  options: Pick<ApiClientRequestOptions<Operation, Operations>, 'variables'>,
) {
  return (await fetch(`shopify:admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    body: JSON.stringify({ query, ...options }),
  })) as ResponseWithType<FetchResponseBody<ReturnData<Operation, Operations>>>;
}
