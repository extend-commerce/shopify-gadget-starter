import { applyParams, save, type ActionOptions } from 'gadget-server';
import { preventCrossShopDataAccess } from 'gadget-server/shopify';
import { identifyShop } from '../../../../shared/mantle.server';

export const run: ActionRun = async ({ params, record }) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ record, api }) => {
  await identifyShop(record, api);
};

export const options: ActionOptions = { actionType: 'update' };
