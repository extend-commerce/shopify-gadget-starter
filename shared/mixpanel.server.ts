import Mixpanel from 'mixpanel';

export function getMixpanel() {
  if (!process.env.GADGET_PUBLIC_MIXPANEL_TOKEN) {
    console.error('GADGET_PUBLIC_MIXPANEL_TOKEN not found'); // eslint-disable-line no-console
    return null;
  }

  return Mixpanel.init(process.env.GADGET_PUBLIC_MIXPANEL_TOKEN);
}
