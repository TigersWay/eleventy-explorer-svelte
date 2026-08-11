import { mount } from 'svelte';
import './app.css';
import { Router } from 'sv-router';
import './router.js';

const app = mount(Router, {
  target: /** @type {HTMLElement} */ (document.getElementById('app'))
});

export default app;
