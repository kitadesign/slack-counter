import { Trigger } from 'deno-slack-api/types.ts';
import { Workflow } from '../workflow.ts';
import env from '../../env.ts';

const trigger: Trigger<typeof Workflow.definition> = {
  type: 'event',
  event: {
    event_type: 'slack#/events/app_mentioned',
    channel_ids: [`${env.CHANNEL_ID}`], // 環境変数で指定する
  },
  name: 'Mention trigger',
  workflow: '#/workflows/counter',
  'inputs': {
    'text': {
      value: '{{data.text}}',
    },
    'userId': {
      value: '{{data.user_id}}',
    },
    'channelId': {
      value: '{{data.channel_id}}',
    },
  },
};

export default trigger;
