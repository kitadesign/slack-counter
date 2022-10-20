import { DefineDatastore, Schema } from 'deno-slack-sdk/mod.ts';

export const DATASTORE_NAME = 'counter';

export const Datastore = DefineDatastore({
  name: DATASTORE_NAME,
  primary_key: 'id',
  attributes: {
    id: {
      type: Schema.types.string,
    },
    target: {
      type: Schema.types.string,
    },
    counter: {
      type: Schema.types.integer,
    },
  },
});
