import { applyParams, save, type ActionOptions } from 'gadget-server';

export const run: ActionRun = async ({ params, record }) => {
  applyParams(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async () => {
  // Your logic goes here
};

export const options: ActionOptions = { actionType: 'create' };
