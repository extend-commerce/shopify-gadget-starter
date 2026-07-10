import { getAnalytics } from '@packages/shared/analytics.server';
import { applyParams, save, type ActionOptions } from 'gadget-server';
import { preventCrossShopDataAccess } from 'gadget-server/shopify';

export const run: ActionRun = async ({ params, record }) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ record }) => {
  // update record properties in mixpanel
  const analytics = await getAnalytics();

  const updatedShop: Record<string, string> = {};
  // checking for null values so that we don't remove any of the existing values with a null one
  if (record.shopOwner) {
    updatedShop.$name = record.shopOwner;
  }
  if (record.email) {
    updatedShop.$email = record.email;
  }
  if (record.customerEmail) {
    updatedShop.customerEmail = record.customerEmail;
  }
  if (record.planName) {
    updatedShop.plan = record.planName;
  }
  if (record.domain) {
    updatedShop.domain = record.domain;
  }
  if (record.countryName) {
    updatedShop.country = record.countryName;
  }
  analytics.identify(record.id, updatedShop);
};

export const options: ActionOptions = { actionType: 'update' };
