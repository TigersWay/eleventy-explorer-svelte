import { notify } from './utils';

export default {
  // Any incoming request get a "404"
  async fetch(request, env, ctx) {
    return new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
  },

  // Scheduled Handler to send the "Deploy Hook"
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(
      (async () => {
        try {
          const response = await fetch(env.CF_DEPLOY_HOOK_URL, { method: 'POST', headers: { 'User-Agent': 'Cloudflare-Cron-Trigger-Worker' } });
          console.log(`Trigger build.`);
          if (!response.ok) {
            const errorText = await response.text();
            await notify({ message: `Failed to trigger build. Status: ${response.status}. Error: ${errorText}`, tags: ['warning'] });
            console.error(`Failed to trigger build. Status: ${response.status}. Error: ${errorText}`);
          } else {
            const data = await response.json();
            await notify({ message: `Successfully triggered build. Build UUID: ${data.result.build_uuid || 'N/A'}`, tags: ['+1'] });
            console.log(`Successfully triggered build. Build UUID: ${data.result.build_uuid || 'N/A'}`);
          }
        } catch (err) {
          await notify({ message: `Network error while triggering deploy hook: ${err}`, tags: ['skull'] });
          console.error('Network error while triggering deploy hook:', err);
        }
      })()
    );
  }
};
