import { applyParams, save, type ActionOptions } from 'gadget-server';
import { identifyShop } from '../../../../shared/mantle.server';
import { getMixpanel } from '../../../../shared/mixpanel.server';

export const run: ActionRun = async ({ params, record }) => {
  applyParams(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ record, api }) => {
  const mixpanel = getMixpanel();
  mixpanel?.people.set(record.id, {
    $name: record.shopOwner ?? '',
    $email: record.email ?? '',
    customerEmail: record.customerEmail ?? '',
    plan: record.planName ?? '',
    domain: record.domain ?? '',
    country: record.countryName ?? '',
  });
  mixpanel?.track('App Installed', { distinct_id: record.id });

  await identifyShop(record, api);
};

export const options: ActionOptions = { actionType: 'create' };
