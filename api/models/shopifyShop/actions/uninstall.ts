import { applyParams, save, type ActionOptions } from 'gadget-server';
import { preventCrossShopDataAccess } from 'gadget-server/shopify';
import { getMixpanel } from '../../../services/mixpanel';

export const run: ActionRun = async ({ params, record }) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ record }) => {
  if (process.env.NODE_ENV === 'production') {
    const mixpanel = getMixpanel();
    mixpanel?.track('App Uninstalled', { distinct_id: record.id });
  }
};

export const options: ActionOptions = { actionType: 'update' };
