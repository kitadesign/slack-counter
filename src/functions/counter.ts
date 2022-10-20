import { DefineFunction, Schema, SlackFunction } from 'deno-slack-sdk/mod.ts';
import { SlackAPI } from 'deno-slack-api/mod.ts';
import { Datastore, DATASTORE_NAME } from '../datastore.ts';

export const CounterFunction = DefineFunction({
  callback_id: 'counter-function',
  title: 'Counter',
  source_file: 'src/functions/counter.ts',
  input_parameters: {
    properties: {
      target: {
        type: Schema.types.string,
      },
      plus: {
        type: Schema.types.boolean,
      },
    },
    required: ['target', 'plus'],
  },
  output_parameters: {
    properties: {
      counter: {
        type: Schema.types.number,
      },
    },
    required: [],
  },
});

export default SlackFunction(CounterFunction, async ({ inputs, token }) => {
  if (!inputs.target) {
    return { outputs: {} };
  }

  const client = SlackAPI(token, {});

  // Datastoreからデータをターゲットの取得する
  const result = await client.apps.datastore.query<typeof Datastore.definition>(
    {
      datastore: DATASTORE_NAME,
      expression: '#target = :target',
      expression_attributes: { '#target': 'target' },
      expression_values: { ':target': inputs.target }, // インプットからターゲット指定
    },
  );

  let counter = 0;

  if (result.items.length > 0) {
    // データがあったら
    const item = result.items[0];
    counter = inputs.plus ? item.counter + 1 : item.counter - 1;
    await client.apps.datastore.put({
      datastore: DATASTORE_NAME,
      item: {
        id: item.id,
        counter: counter,
      },
    });
  } else {
    // 新規ターゲットの場合
    counter = inputs.plus ? counter + 1 : counter - 1;
    await client.apps.datastore.put({
      datastore: DATASTORE_NAME,
      item: {
        id: crypto.randomUUID(),
        target: inputs.target,
        counter: counter,
      },
    });
  }

  return {
    outputs: {
      counter,
    },
  };
});
