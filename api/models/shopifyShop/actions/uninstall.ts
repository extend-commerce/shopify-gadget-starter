import { applyParams, save, type ActionOptions } from 'gadget-server';
import { preventCrossShopDataAccess } from 'gadget-server/shopify';
import { getAnalytics } from '../../../../shared/analytics.server';

export const run: ActionRun = async ({ params, record }) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ record }) => {
  const analytics = await getAnalytics();
  analytics.track('app_uninstalled', { distinct_id: record.id });
};

export const options: ActionOptions = { actionType: 'update' };
