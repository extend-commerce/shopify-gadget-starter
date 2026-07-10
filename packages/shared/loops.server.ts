/* eslint-disable no-console */

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  type Select,
  type ShopifyShop as ShopifyShopModel,
} from '@gadget-client/shopify-gadget-starter';
import { LoopsClient } from 'loops';

type BaseShopifyShop = Select<
  ShopifyShopModel,
  { id: true; name: true; email: true; myshopifyDomain: true }
>;

const loops = new LoopsClient(process.env.LOOPS_API_KEY!);

// Loops configuration
const LOOPS_APP_MAILING_LIST_ID = process.env.LOOPS_APP_MAILING_LIST_ID!;
const LOOPS_UNINSTALL_MAILING_LIST_ID = process.env.LOOPS_UNINSTALL_MAILING_LIST_ID!;
const LOOPS_APP_NAME = process.env.LOOPS_APP_NAME!;

export const AppStatus = {
  installed: 'installed',
  uninstalled: 'uninstalled',
} as const;

export const AppEvent = {
  appInstalled: 'app_installed',
  appReinstalled: 'app_reinstalled',
  appUninstalled: 'app_uninstalled',
} as const;

interface GenericFailureResponse {
  success: false;
  error: string;
}

function errorHandler(error: unknown): GenericFailureResponse {
  const message = error instanceof Error ? error.message : 'Unknown error';
  return { success: false as const, error: message };
}

export async function onInstall(shop: BaseShopifyShop): Promise<void> {
  // create contact in loops
  const contact = await loops
    .createContact({
      email: shop.email!,
      properties: {
        userId: shop.id,
        shopName: shop.name,
        shopDomain: shop.myshopifyDomain,
        status: AppStatus.installed,
      },
      mailingLists: {
        [LOOPS_APP_MAILING_LIST_ID]: true,
      },
    })
    .catch(errorHandler);

  if (contact.success) {
    console.log(`Contact successfully created with contactId ${contact.id} for shop ${shop.id}`);
  } else {
    return console.error(`Failed to create contact for shop ${shop.id}: ${contact.error}`);
  }

  // send app_installed event, this will trigger the welcome email flow
  const evt = await loops
    .sendEvent({
      userId: contact.id,
      email: shop.email!,
      eventName: AppEvent.appInstalled,
      mailingLists: { [LOOPS_APP_MAILING_LIST_ID]: true },
      eventProperties: { app_name: LOOPS_APP_NAME },
    })
    .catch(errorHandler);

  if (evt.success) {
    console.log(`app_installed event sent successfully for shop ${shop.id}`);
  } else {
    console.error(`Failed to send app_installed event for shop ${shop.id}`);
  }
}

export async function onReinstall(shop: BaseShopifyShop): Promise<void> {
  // update contact in loops
  const contact = await loops
    .updateContact({
      email: shop.email!,
      properties: { status: AppStatus.installed },
      mailingLists: {
        [LOOPS_APP_MAILING_LIST_ID]: true,
        [LOOPS_UNINSTALL_MAILING_LIST_ID]: false,
      },
    })
    .catch(errorHandler);

  if (contact.success) {
    console.log(`Contact updated successfully for shop ${shop.id}`);
  } else {
    return console.error(`Failed to update contact for shop ${shop.id}: ${contact.error}`);
  }

  // send app_reinstalled event, this will trigger the reinstallation email flow
  const evt = await loops
    .sendEvent({
      userId: contact.id,
      email: shop.email!,
      eventName: AppEvent.appReinstalled,
      mailingLists: { [LOOPS_APP_MAILING_LIST_ID]: true },
      eventProperties: { app_name: LOOPS_APP_NAME },
    })
    .catch(errorHandler);

  if (evt.success) {
    console.log(`app_reinstalled event sent successfully for shop ${shop.id}`);
  } else {
    console.error(`Failed to send app_reinstalled event for shop ${shop.id}`);
  }
}

export async function onUninstall(shop: BaseShopifyShop): Promise<void> {
  // update contact in loops
  const contact = await loops
    .updateContact({
      email: shop.email!,
      properties: { status: AppStatus.uninstalled },
      mailingLists: {
        [LOOPS_APP_MAILING_LIST_ID]: false,
        [LOOPS_UNINSTALL_MAILING_LIST_ID]: true,
      },
    })
    .catch(errorHandler);

  if (contact.success) {
    console.log(`Contact with id ${contact.id} deleted successfully for shop ${shop.id}`);
  } else {
    return console.error(`Failed to delete contact for shop ${shop.id}: ${contact.error}`);
  }

  // send app_uninstalled event, this will trigger the uninstallation email flow
  const evt = await loops
    .sendEvent({
      userId: contact.id,
      email: shop.email!,
      eventName: AppEvent.appUninstalled,
      mailingLists: { [LOOPS_UNINSTALL_MAILING_LIST_ID]: true },
      eventProperties: { app_name: LOOPS_APP_NAME },
    })
    .catch(errorHandler);

  if (evt.success) {
    console.log(`app_uninstalled event sent successfully for shop ${shop.id}`);
  } else {
    console.error(`Failed to send app_uninstalled event for shop ${shop.id}`);
  }
}
