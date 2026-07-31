/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */

import {
  type GadgetRecord,
  type Select,
  type ShopifyShop,
} from '@gadget-client/shopify-gadget-starter';
import { LoopsClient, type Contact } from 'loops';

interface GenericFailureResponse {
  success: false;
  error: string;
}

type Selection = {
  id: true;
  name: true;
  email: true;
  myshopifyDomain: true;
};

type ShopifyShopRecord = GadgetRecord<Select<ShopifyShop, Selection>>;

const LOOPS_APP_NAME = process.env.LOOPS_APP_NAME!;
const LOOPS_APP_MAILING_LIST_ID = process.env.LOOPS_APP_MAILING_LIST_ID!;
const LOOPS_UNINSTALL_MAILING_LIST_ID = process.env.LOOPS_UNINSTALL_MAILING_LIST_ID!;

export const AppStatus = {
  installed: 'installed',
  uninstalled: 'uninstalled',
} as const;
export type AppStatus = (typeof AppStatus)[keyof typeof AppStatus];

export const AppEvent = {
  appInstalled: 'app_installed',
  appReinstalled: 'app_reinstalled',
  appUninstalled: 'app_uninstalled',
} as const;
export type AppEvent = (typeof AppEvent)[keyof typeof AppEvent];

interface CreateContactPayload {
  email: string;
  userId: string;
  shopName: string;
  shopDomain: string;
  status: AppStatus;
}

function errorHandler(error: unknown): GenericFailureResponse {
  const message = error instanceof Error ? error.message : 'Unknown error';
  return { success: false as const, error: message };
}

export class LoopsService {
  client: LoopsClient | null = null;

  constructor() {
    if (process.env.LOOPS_API_KEY) {
      this.client = new LoopsClient(process.env.LOOPS_API_KEY);
    } else {
      console.error('LOOPS_API_KEY is not set');
    }
  }

  public async onInstall(record: ShopifyShopRecord): Promise<void> {
    const contactId = await this.createContact({
      email: record.email!,
      userId: record.id,
      shopName: record.name ?? '',
      shopDomain: record.myshopifyDomain ?? '',
      status: AppStatus.installed,
    });

    if (contactId) {
      await this.sendEvent(contactId, AppEvent.appInstalled);
    }
  }

  public async onReinstall(record: ShopifyShopRecord): Promise<void> {
    const existingContact = await this.findContact(record.email!);

    if (existingContact) {
      await this.setStatus(existingContact.id, AppStatus.installed);
      await this.sendEvent(existingContact.id, AppEvent.appReinstalled);
      return;
    }

    const contactId = await this.createContact({
      email: record.email!,
      userId: record.id,
      shopName: record.name ?? '',
      shopDomain: record.myshopifyDomain ?? '',
      status: AppStatus.installed,
    });

    if (contactId) {
      await this.sendEvent(contactId, AppEvent.appReinstalled);
    }
  }

  public async onUninstall(record: ShopifyShopRecord): Promise<void> {
    const existingContact = await this.findContact(record.email!);

    if (existingContact) {
      await this.setStatus(existingContact.id, AppStatus.uninstalled);
      await this.sendEvent(existingContact.id, AppEvent.appUninstalled);
      return;
    }

    const contactId = await this.createContact({
      email: record.email!,
      userId: record.id,
      shopName: record.name ?? '',
      shopDomain: record.myshopifyDomain ?? '',
      status: AppStatus.uninstalled,
    });

    if (contactId) {
      await this.sendEvent(contactId, AppEvent.appUninstalled);
    }
  }

  private async createContact(payload: CreateContactPayload): Promise<string | null> {
    const response = await this.client
      ?.createContact({
        email: payload.email,
        properties: {
          userId: payload.userId,
          shopName: payload.shopName,
          shopDomain: payload.shopDomain,
          status: payload.status,
        },
        mailingLists: {
          [LOOPS_APP_MAILING_LIST_ID]: payload.status === AppStatus.installed,
          [LOOPS_UNINSTALL_MAILING_LIST_ID]: payload.status === AppStatus.uninstalled,
        },
      })
      .catch(errorHandler);

    if (response?.success) {
      console.log(
        `Contact successfully created with contactId ${response.id} for shop ${payload.shopDomain}`,
      );
      return response.id;
    }

    console.error(`Failed to create contact for shop ${payload.shopDomain}: ${response?.error}`);
    return null;
  }

  private async sendEvent(contactId: string, event: AppEvent): Promise<boolean> {
    const mailingLists: Record<string, boolean> = {};
    if (event === AppEvent.appUninstalled) {
      mailingLists[LOOPS_UNINSTALL_MAILING_LIST_ID] = true;
    } else {
      mailingLists[LOOPS_APP_MAILING_LIST_ID] = true;
    }

    const response = await this.client
      ?.sendEvent({
        eventName: event,
        userId: contactId,
        mailingLists,
        eventProperties: { app_name: LOOPS_APP_NAME },
      })
      .catch(errorHandler);

    if (response?.success) {
      console.log(`Event ${event} sent successfully for user ${contactId}`);
      return true;
    }

    console.error(`Failed to send event ${event} for user ${contactId}`);
    return false;
  }

  private async setStatus(contactId: string, status: AppStatus): Promise<boolean> {
    const mailingLists: Record<string, boolean> = {};

    if (status === AppStatus.installed) {
      mailingLists[LOOPS_APP_MAILING_LIST_ID] = true;
      mailingLists[LOOPS_UNINSTALL_MAILING_LIST_ID] = false;
    } else {
      mailingLists[LOOPS_APP_MAILING_LIST_ID] = false;
      mailingLists[LOOPS_UNINSTALL_MAILING_LIST_ID] = true;
    }

    const response = await this.client
      ?.updateContact({
        userId: contactId,
        properties: { status },
        mailingLists,
      })
      .catch(errorHandler);

    if (response?.success) {
      console.log(`Status ${status} set successfully for user ${contactId}`);
      return true;
    }

    console.error(`Failed to set status ${status} for user ${contactId}`);
    return false;
  }

  private async findContact(email: string): Promise<Contact | null> {
    const response = (await this.client?.findContact({ email })) ?? [];
    if (response.length > 0) {
      return response.at(0) ?? null;
    }

    return null;
  }
}
