import { applyParams, save, type ActionOptions } from 'gadget-server';
import { getAnalytics } from '../../../../shared/analytics.server';
import { identifyShop } from '../../../../shared/mantle.server';

export const run: ActionRun = async ({ params, record }) => {
  applyParams(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ record, api }) => {
  // for pulling in existing subscriptions and app data
  await api.shopifySync.run({
    domain: record.domain,
    shop: { _link: record.id },
    models: ['shopifyAppSubscription', 'shopifyApp'],
  });

  const analytics = await getAnalytics();
  analytics.identify(record.id, {
    $name: record.shopOwner ?? '',
    $email: record.email ?? '',
    customerEmail: record.customerEmail ?? '',
    plan: record.planName ?? '',
    domain: record.domain ?? '',
    country: record.countryName ?? '',
  });
  analytics.track('app_installed', { distinct_id: record.id });

  // Pull in the Mantle token on install and store it on the shop record for future use
  const mantleCustomer = await identifyShop(record);
  if (mantleCustomer) {
    await api.internal.shopifyShop.update(record.id, {
      shopifyShop: {
        mantleApiToken: mantleCustomer.apiToken,
      },
    });
  }
};

export const options: ActionOptions = { actionType: 'create' };
