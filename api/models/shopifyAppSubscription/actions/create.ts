import { applyParams, save, type ActionOptions } from 'gadget-server';
import { preventCrossShopDataAccess } from 'gadget-server/shopify';

export const run: ActionRun = async ({ params, record }) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ record, api }) => {
  if (record.status === 'ACTIVE' && record.shopId) {
    // cleanup charge id from shop record to avoid confusion, since the subscription is active now
    await api.internal.shopifyShop.update(record.shopId, { chargeId: null });
  }
};

export const options: ActionOptions = { actionType: 'create' };
