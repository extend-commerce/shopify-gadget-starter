import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.6.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2026-01",
        enabledModels: ["shopifyApp", "shopifyAppSubscription"],
        type: "partner",
        scopes: ["read_products"],
      },
    },
  },
};
