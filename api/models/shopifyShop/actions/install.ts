import { getAnalytics } from '@packages/shared/analytics.server';
import { onInstall } from '@packages/shared/loops.server';
import { applyParams, save, type ActionOptions } from 'gadget-server';

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

  await onInstall(record);

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
};

export const options: ActionOptions = { actionType: 'create' };
