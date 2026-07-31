/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import * as AdminTypes from './admin.types.ts';

export type GetProductsQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type GetProductsQuery = { products: { nodes: Array<(
      Pick<AdminTypes.Product, 'id' | 'title' | 'handle'>
      & { featuredMedia?: AdminTypes.Maybe<{ preview?: AdminTypes.Maybe<{ image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url' | 'altText'>> }> }>, priceRangeV2: { minVariantPrice: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> } }
    )> } };

export type CheckActiveAppSubscriptionsQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type CheckActiveAppSubscriptionsQuery = { currentAppInstallation: { activeSubscriptions: Array<Pick<AdminTypes.AppSubscription, 'id' | 'status'>> } };

interface GeneratedQueryTypes {
  "#graphql\n  query GetProducts {\n    products(first: 10) {\n      nodes {\n        id\n        title\n        handle\n        featuredMedia {\n          preview {\n            image {\n              url\n              altText\n            }\n          }\n        }\n        priceRangeV2 {\n          minVariantPrice {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n  }\n": {return: GetProductsQuery, variables: GetProductsQueryVariables},
  "#graphql\n  query CheckActiveAppSubscriptions {\n    currentAppInstallation {\n      activeSubscriptions {\n        id\n        status\n      }\n    }\n  }\n": {return: CheckActiveAppSubscriptionsQuery, variables: CheckActiveAppSubscriptionsQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
