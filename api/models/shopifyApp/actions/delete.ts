import { deleteRecord, type ActionOptions } from 'gadget-server';

export const run: ActionRun = async ({ record }) => {
  await deleteRecord(record);
};

export const onSuccess: ActionOnSuccess = async () => {
  // Your logic goes here
};

export const options: ActionOptions = { actionType: 'delete' };
