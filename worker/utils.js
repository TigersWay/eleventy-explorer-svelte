import { env } from 'cloudflare:workers';

/**
 * Console via ntfy, if server and topic are provided.
 *
 * @param {string|object} msg
 * @param {string|null} topic
 * @param {string|null} ntfy
 */
export const notify = async (msg, topic = env.NTFY_TOPIC, ntfy = env.NTFY_SERVER) => {
  if (topic && ntfy) {
    if (typeof msg == 'string') await fetch(`${ntfy}/${topic}`, { method: 'POST', body: msg });
    else {
      msg.topic = topic;
      await fetch(`${ntfy}`, { method: 'POST', body: JSON.stringify(msg) });
    }
  };
};
