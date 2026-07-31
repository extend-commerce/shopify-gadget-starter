import { getAnalytics } from '@packages/shared/analytics.server';
import { LoopsService } from '@packages/shared/loops.server';
import { applyParams, save, type ActionOptions } from 'gadget-server';
import { preventCrossShopDataAccess } from 'gadget-server/shopify';

export const run: ActionRun = async ({ params, record }) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ record }) => {
  const loops = new LoopsService();
  await loops.onUninstall(record);

  const analytics = await getAnalytics();
  analytics.track('app_uninstalled', { distinct_id: record.id });
};

export const options: ActionOptions = { actionType: 'update' };
