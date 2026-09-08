import { notify } from './utils';

export default {
  // Any incoming request get a "404"
  async fetch(request, env, ctx) {
    return new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
  },

  // Scheduled Handler to send the "Deploy Hook" and trigger the build
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(
      (async () => {
        try {
          const response = await fetch(env.CF_DEPLOY_HOOK_URL, { method: 'POST', headers: { 'User-Agent': 'Cloudflare-Cron-Trigger-Worker' } });

          if (!response.ok) {
            const errorText = await response.text();
            const message = `Failed to trigger build. Status: ${response.status}. Error: ${errorText}`;
            await notify({ message, tags: ['warning'] });
            console.error(message);
            return;
          }

          const data = await response.json();
          const message = `Successfully triggered build. Build UUID: ${data.result?.build_uuid || 'N/A'}`;
          await notify({ message, tags: ['+1'] });
          console.log(message);
        } catch (err) {
          const message = `Network error while triggering deploy hook: ${err}`;
          await notify({ message, tags: ['skull'] });
          console.error(message, err);
        }
      })()
    );
  },

  // Queue consumer: receives Workers builds events (started/succeeded/failed/canceled)
  async queue(batch, env, ctx) {
    const BUILD_EVENT_TAGS = {
      'cf.workersBuilds.worker.build.succeeded': { label: 'Successful', tags: ['+1'] },
      'cf.workersBuilds.worker.build.failed': { label: 'Failed', tags: ['skull'] },
      'cf.workersBuilds.worker.build.canceled': { label: 'Canceled', tags: ['warning'] }
    };

    for (const message of batch.messages) {
      try {
        const event = typeof message.body === 'string' ? JSON.parse(message.body) : message.body;

        if (event?.source?.type !== 'workersBuilds.worker') {
          // Not a build event (shouldn't happen if the queue is dedicated to this subscription.
          message.ack();
          continue;
        }

        const info = BUILD_EVENT_TAGS[event.type];
        if (!info) {
          // e.g. build.started, or a future event type we don't/won't handle.
          message.ack();
          continue;
        }

        const buildUuid = event.payload?.buildUuid ?? 'N/A';
        const branch = event.payload?.buildTriggerMetadata?.branch ?? '?';
        const text = `${info.label} build (UUID: ${buildUuid}, branch: ${branch}).`;

        await notify({ message: text, tags: info.tags });
        console.log(text);
        message.ack();
      } catch (err) {
        console.error('Failed to process build event:', err);
        message.retry();
      }
    }
  }
};
