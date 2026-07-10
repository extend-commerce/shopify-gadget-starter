import { getAnalytics } from '@packages/shared/analytics.server';
import { onReinstall } from '@packages/shared/loops.server';
import { applyParams, save, type ActionOptions } from 'gadget-server';
import { preventCrossShopDataAccess } from 'gadget-server/shopify';

export const run: ActionRun = async ({ params, record }) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ record, api }) => {
  // for reconciliation of existing subscriptions
  await api.shopifySync.run({
    domain: record.domain,
    shop: { _link: record.id },
    models: ['shopifyAppSubscription'],
  });

  await onReinstall(record);

  const analytics = await getAnalytics();
  analytics.track('app_reinstalled', { distinct_id: record.id });
};

export const options: ActionOptions = { actionType: 'update' };
