import { applyParams, save, type ActionOptions } from 'gadget-server';
import { preventCrossShopDataAccess, shopifySync } from 'gadget-server/shopify';

export const run: ActionRun = async ({ params, record }) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
  await shopifySync(params, record);
};

export const onSuccess: ActionOnSuccess = async () => {
  // Your logic goes here
};

export const options: ActionOptions = {
  actionType: 'create',
  triggers: { api: true },
};
