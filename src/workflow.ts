import { DefineWorkflow, Schema } from 'deno-slack-sdk/mod.ts';
import { ExtractFunction } from './functions/extract.ts';
import { CounterFunction } from './functions/counter.ts';
import { SendFunction } from './functions/send.ts';

export const Workflow = DefineWorkflow({
  callback_id: 'counter',
  title: 'Counter Workflow',
  input_parameters: {
    properties: {
      text: {
        type: Schema.types.string,
      },
      userId: {
        type: Schema.slack.types.user_id,
      },
      channelId: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ['text', 'userId', 'channelId'],
  },
});

// テキストからデータ取得処理
const extractStep = Workflow.addStep(ExtractFunction, {
  body: Workflow.inputs.text,
});

// カウンター処理
const CounterStep = Workflow.addStep(CounterFunction, {
  target: extractStep.outputs.target,
  plus: extractStep.outputs.plus,
});

// 送信処理
Workflow.addStep(SendFunction, {
  channelId: Workflow.inputs.channelId,
  target: extractStep.outputs.target,
  counter: CounterStep.outputs.counter,
});

export default Workflow;
