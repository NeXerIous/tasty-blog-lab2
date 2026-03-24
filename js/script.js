import { initRecipeTabs } from './components/recipe-tabs.js';
import { initComments } from './components/comments.js';
import { initCookingTimer } from './components/cooking-timer.js';

document.addEventListener('DOMContentLoaded', () => {
    initRecipeTabs();
    initComments();
    initCookingTimer();
});
