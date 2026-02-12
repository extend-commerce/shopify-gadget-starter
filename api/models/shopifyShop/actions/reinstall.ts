import { applyParams, save, type ActionOptions } from 'gadget-server';
import { preventCrossShopDataAccess } from 'gadget-server/shopify';
import { getAnalytics } from '../../../../shared/analytics.server';
import { identifyShop } from '../../../../shared/mantle.server';

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

  const analytics = await getAnalytics();
  analytics.track('app_reinstalled', { distinct_id: record.id });

  // Update in the Mantle token on reinstall
  const mantleCustomer = await identifyShop(record);
  if (mantleCustomer) {
    await api.internal.shopifyShop.update(record.id, {
      shopifyShop: {
        mantleApiToken: mantleCustomer.apiToken,
      },
    });
  }
};

export const options: ActionOptions = { actionType: 'update' };
