import { type ActionOptions } from 'gadget-server';
import { updateMissingTokens } from '../../shared/mantle.server';

export const run: ActionRun = async ({ api }) => {
  await updateMissingTokens(api);
};

export const options: ActionOptions = {
  triggers: {
    scheduler: [{ every: 'day', at: '00:00 UTC' }],
  },
};
