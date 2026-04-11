import {
  type AllOperations,
  type ApiClientRequestOptions,
  type FetchResponseBody,
  type ResponseWithType,
  type ReturnData,
} from '@shopify/admin-api-client';

const API_VERSION = '2026-04';

declare module '@shopify/admin-api-client' {
  interface AllOperations extends AdminQueries, AdminMutations {}
}

export async function graphql<Operation extends keyof Operations, Operations extends AllOperations>(
  payload: Pick<ApiClientRequestOptions<Operation, Operations>, 'variables'> & {
    query: Operation;
  },
) {
  const response = (await fetch(`shopify:admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })) as ResponseWithType<FetchResponseBody<ReturnData<Operation, Operations>>>;

  if (!response.ok) {
    throw new Error(`[GRAPHQL]: operation failed`, {
      cause: await response.text(),
    });
  }

  const body = await response.json();

  if (hasErrors(body)) {
    throw new Error(`[GRAPHQL]: operation errored`, {
      cause: body.errors,
    });
  }

  return body.data;
}

function hasErrors(body: unknown): body is { errors: Array<{ message: string }> } {
  return (
    typeof body === 'object' &&
    body !== null &&
    'errors' in body &&
    Array.isArray(body.errors) &&
    body.errors.length > 0
  );
}
