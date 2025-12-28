import { type ShopifyConnection } from 'gadget-server';
import z from 'zod/v4';

const User = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  account_owner: z.boolean(),
  locale: z.string(),
  collaborator: z.boolean(),
  email_verified: z.boolean(),
});
export type User = z.infer<typeof User>;

export async function getCurrentUser(shopify: ShopifyConnection) {
  const {
    currentSession,
    currentClientSecret,
    currentClientId,
    currentShopDomain,
  } = shopify;

  if (!currentSession) return null;

  const payload = {
    client_id: currentClientId,
    client_secret: currentClientSecret,
    subject_token: currentSession.token,
    grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
    subject_token_type: 'urn:ietf:params:oauth:token-type:id_token',
    requested_token_type:
      'urn:shopify:params:oauth:token-type:online-access-token',
  };

  const response = await fetch(
    `https://${currentShopDomain}/admin/oauth/access_token`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    },
  )
    .then(res => (res.ok ? res.json() : null))
    .catch(() => null);

  const ResponseSchema = z.object({ associated_user: User });
  const parsedResponse = ResponseSchema.safeParse(response);
  if (!parsedResponse.success) {
    return null;
  }

  return parsedResponse.data.associated_user;
}

export function safeUser(user: User) {
  return {
    id: user.id.toString(),
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    locale: user.locale,
  };
}
