import { getElement } from '../utils/dom.js';

const MOBILE_BREAKPOINT = 1024;

const timerPresets = {
    'lemon-garlic-chicken': {
        recipeTitle: 'Lemon Garlic Roasted Chicken',
        totalSeconds: 60 * 60,
        steps: [
            {
                title: 'Preheat and Prepare',
                durationSeconds: 5 * 60,
                notification: 'Step complete: Preheat and Prepare. Continue when you are ready for the citrus infusion.',
            },
            {
                title: 'Citrus Infusion',
                durationSeconds: 10 * 60,
                notification: 'Step complete: Citrus Infusion. Continue when you are ready to add the herb blend.',
            },
            {
                title: 'Herb Blend',
                durationSeconds: 10 * 60,
                notification: 'Step complete: Herb Blend. Continue when you are ready to roast the chicken.',
            },
            {
                title: 'Roast to Perfection',
                durationSeconds: 30 * 60,
                notification: 'Step complete: Roast to Perfection. Continue when you are ready for the final pairing notes.',
            },
            {
                title: 'Pairing Suggestions',
                durationSeconds: 5 * 60,
                notification: 'Cooking complete. Your recipe timer is finished.',
            },
        ],
    },
    'savory-herb-chicken': {
        recipeTitle: 'Savory Herb-Infused Chicken',
        totalSeconds: 40 * 60,
        steps: [
            {
                title: 'Build the Herb Paste',
                durationSeconds: 5 * 60,
                notification: 'Step complete: Build the Herb Paste. Continue when you are ready to coat the chicken.',
            },
            {
                title: 'Coat the Chicken',
                durationSeconds: 8 * 60,
                notification: 'Step complete: Coat the Chicken. Continue when you are ready to roast.',
            },
            {
                title: 'Roast the Chicken',
                durationSeconds: 20 * 60,
                notification: 'Step complete: Roast the Chicken. Continue when you are ready to finish and slice.',
            },
            {
                title: 'Finish and Slice',
                durationSeconds: 7 * 60,
                notification: 'Cooking complete. Your recipe timer is finished.',
            },
        ],
    },
    'decadent-chocolate-mousse': {
        recipeTitle: 'Decadent Chocolate Mousse',
        totalSeconds: 30 * 60,
        steps: [
            {
                title: 'Melt the Chocolate',
                durationSeconds: 6 * 60,
                notification: 'Step complete: Melt the Chocolate. Continue when you are ready to whisk the base.',
            },
            {
                title: 'Whisk the Base',
                durationSeconds: 6 * 60,
                notification: 'Step complete: Whisk the Base. Continue when you are ready to fold and portion.',
            },
            {
                title: 'Fold and Portion',
                durationSeconds: 8 * 60,
                notification: 'Step complete: Fold and Portion. Continue when you are ready to chill and finish.',
            },
            {
                title: 'Chill and Finish',
                durationSeconds: 10 * 60,
                notification: 'Cooking complete. Your recipe timer is finished.',
            },
        ],
    },
};

export function initCookingTimer() {
    const root = getElement('[data-cooking-timer]');
    const startButton = getElement('[data-start-cooking]');
    const toasts = getElement('[data-timer-toasts]');

    if (!root || !startButton || !toasts) {
        return;
    }

    const elements = {
        root,
        toasts,
        startButton,
        dragHandle: getElement('[data-timer-drag-handle]', root),
        ring: getElement('[data-timer-ring]', root),
        recipeTitle: getElement('[data-timer-recipe-title]', root),
        time: getElement('[data-timer-time]', root),
        stepLabel: getElement('[data-timer-step-label]', root),
        stepTitle: getElement('[data-timer-step-title]', root),
        recipeTotal: getElement('[data-timer-recipe-total]', root),
        toggle: getElement('[data-timer-toggle]', root),
        toggleIcon: getElement('[data-timer-toggle-icon]', root),
        restart: getElement('[data-timer-restart]', root),
        close: getElement('[data-timer-close]', root),
        mobileStepLabel: getElement('[data-mobile-step-label]', root),
        mobileStepTitle: getElement('[data-mobile-step-title]', root),
        mobileBar: getElement('[data-mobile-bar]', root),
        mobileProgress: getElement('[data-mobile-progress]', root),
        mobileTime: getElement('[data-mobile-time]', root),
        mobileRecipeTotal: getElement('[data-mobile-recipe-total]', root),
        mobileToggle: getElement('[data-timer-toggle-mobile]', root),
        mobileToggleIcon: getElement('[data-timer-toggle-icon-mobile]', root),
        mobileRestart: getElement('[data-timer-restart-mobile]', root),
        mobileClose: getElement('[data-timer-close-mobile]', root),
    };

    const state = {
        activeRecipeId: getActiveRecipeId(),
        isOpen: false,
        isRunning: false,
        currentStepIndex: 0,
        remainingStepSeconds: 0,
        intervalId: null,
        position: { x: 24, y: 24 },
        pointerDrag: null,
        frameId: null,
    };

    resetTimerForRecipe(state.activeRecipeId, state);
    renderTimer(elements, state);

    startButton.addEventListener('click', () => {
        openTimer(elements, state);
    });

    elements.toggle.addEventListener('click', () => {
        toggleTimer(elements, state);
    });

    elements.toggle.addEventListener('pointerdown', (event) => {
        event.stopPropagation();
    });

    elements.mobileToggle.addEventListener('click', () => {
        toggleTimer(elements, state);
    });

    elements.restart.addEventListener('click', () => {
        restartTimer(elements, state);
    });

    elements.restart.addEventListener('pointerdown', (event) => {
        event.stopPropagation();
    });

    elements.mobileRestart.addEventListener('click', () => {
        restartTimer(elements, state);
    });

    elements.close.addEventListener('click', () => {
        closeTimer(elements, state);
    });

    elements.mobileClose.addEventListener('click', () => {
        closeTimer(elements, state);
    });

    elements.dragHandle.addEventListener('pointerdown', (event) => {
        beginWindowDrag(event, elements, state);
    });

    elements.ring.addEventListener('pointerdown', (event) => {
        beginRingScrub(event, elements, state);
    });

    elements.mobileBar.addEventListener('pointerdown', (event) => {
        beginMobileScrub(event, elements, state);
    });

    window.addEventListener('pointermove', (event) => {
        handlePointerMove(event, elements, state);
    });

    window.addEventListener('pointerup', () => {
        stopPointerDrag(state);
    });

    window.addEventListener('pointercancel', () => {
        stopPointerDrag(state);
    });

    window.addEventListener('resize', () => {
        applyWindowPosition(elements, state);
    });

    document.addEventListener('recipechange', (event) => {
        const nextRecipeId = event.detail?.recipeId;

        if (!nextRecipeId || !timerPresets[nextRecipeId]) {
            return;
        }

        state.activeRecipeId = nextRecipeId;
        resetTimerForRecipe(nextRecipeId, state);
        renderTimer(elements, state);
    });
}

function openTimer(elements, state) {
    state.isOpen = true;
    elements.root.hidden = false;
    applyWindowPosition(elements, state);
    renderTimer(elements, state);
}

function closeTimer(elements, state) {
    pauseTimer(state);
    state.isOpen = false;
    elements.root.hidden = true;
}

function toggleTimer(elements, state) {
    if (state.isRunning) {
        pauseTimer(state);
        renderTimer(elements, state);
    } else {
        resumeTimer(elements, state);
    }
}

function resumeTimer(elements, state) {
    if (state.isRunning) {
        return;
    }

    state.isRunning = true;
    clearInterval(state.intervalId);

    state.intervalId = setInterval(() => {
        tickTimer(elements, state);
    }, 1000);

    renderTimer(elements, state);
}

function pauseTimer(state) {
    state.isRunning = false;
    clearInterval(state.intervalId);
    state.intervalId = null;
}

function restartTimer(elements, state) {
    resetTimerForRecipe(state.activeRecipeId, state);
    renderTimer(elements, state);
    showNotification(elements, `Timer restarted for ${timerPresets[state.activeRecipeId].recipeTitle}.`);
}

function tickTimer(elements, state) {
    if (!state.isRunning) {
        return;
    }

    state.remainingStepSeconds -= 1;

    if (state.remainingStepSeconds > 0) {
        renderTimer(elements, state);
        return;
    }

    const preset = timerPresets[state.activeRecipeId];
    const currentStep = preset.steps[state.currentStepIndex];
    const nextStep = preset.steps[state.currentStepIndex + 1];

    pauseTimer(state);

    if (nextStep) {
        state.currentStepIndex += 1;
        state.remainingStepSeconds = nextStep.durationSeconds;
        renderTimer(elements, state);
        showNotification(elements, currentStep.notification);
        return;
    }

    state.remainingStepSeconds = 0;
    renderTimer(elements, state);
    showNotification(elements, currentStep.notification);
}

function resetTimerForRecipe(recipeId, state) {
    const preset = timerPresets[recipeId];

    pauseTimer(state);
    state.currentStepIndex = 0;
    state.remainingStepSeconds = preset.steps[0].durationSeconds;
}

function renderTimer(elements, state) {
    const preset = timerPresets[state.activeRecipeId];
    const currentStep = preset.steps[state.currentStepIndex];
    const stepDuration = currentStep.durationSeconds;
    const progress = stepDuration ? (stepDuration - state.remainingStepSeconds) / stepDuration : 1;
    const safeProgress = Math.max(0, Math.min(1, progress));

    elements.recipeTitle.textContent = preset.recipeTitle;
    elements.time.textContent = formatTime(state.remainingStepSeconds);
    elements.stepLabel.textContent = `Step ${state.currentStepIndex + 1} of ${preset.steps.length}`;
    elements.stepTitle.textContent = currentStep.title;
    elements.recipeTotal.textContent = `Total recipe: ${formatTime(preset.totalSeconds)}`;
    elements.ring.style.setProperty('--timer-progress', `${safeProgress * 360}deg`);

    elements.mobileStepLabel.textContent = `Step ${state.currentStepIndex + 1} of ${preset.steps.length}`;
    elements.mobileStepTitle.textContent = currentStep.title;
    elements.mobileTime.textContent = formatTime(state.remainingStepSeconds);
    elements.mobileRecipeTotal.textContent = `Total recipe: ${formatTime(preset.totalSeconds)}`;
    elements.mobileProgress.style.width = `${safeProgress * 100}%`;

    const toggleIcon = state.isRunning ? '\u275A\u275A' : '\u25B6';
    const toggleLabel = state.isRunning ? 'Pause timer' : 'Resume timer';

    elements.toggleIcon.textContent = toggleIcon;
    elements.mobileToggleIcon.textContent = toggleIcon;
    elements.toggle.setAttribute('aria-label', toggleLabel);
    elements.mobileToggle.setAttribute('aria-label', toggleLabel);

    if (state.isOpen) {
        applyWindowPosition(elements, state);
    }
}

function beginWindowDrag(event, elements, state) {
    if (isMobileView()) {
        return;
    }

    event.preventDefault();

    state.pointerDrag = {
        type: 'window',
        offsetX: event.clientX - state.position.x,
        offsetY: event.clientY - state.position.y,
    };
}

function beginRingScrub(event, elements, state) {
    if (isMobileView()) {
        return;
    }

    if (event.target.closest('[data-timer-toggle], [data-timer-restart]')) {
        return;
    }

    event.preventDefault();

    state.pointerDrag = {
        type: 'ring',
    };

    updateRingScrub(event, elements, state);
}

function beginMobileScrub(event, elements, state) {
    if (!isMobileView()) {
        return;
    }

    event.preventDefault();

    state.pointerDrag = {
        type: 'mobile-bar',
    };

    updateMobileScrub(event, elements, state);
}

function handlePointerMove(event, elements, state) {
    if (!state.pointerDrag) {
        return;
    }

    if (state.pointerDrag.type === 'window') {
        const nextX = event.clientX - state.pointerDrag.offsetX;
        const nextY = event.clientY - state.pointerDrag.offsetY;

        state.position.x = nextX;
        state.position.y = nextY;
        scheduleWindowPosition(elements, state);
        return;
    }

    if (state.pointerDrag.type === 'mobile-bar') {
        updateMobileScrub(event, elements, state);
        return;
    }

    updateRingScrub(event, elements, state);
}

function updateRingScrub(event, elements, state) {
    const preset = timerPresets[state.activeRecipeId];
    const currentStep = preset.steps[state.currentStepIndex];
    const rect = elements.ring.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    const normalizedAngle = (angle + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
    const progress = normalizedAngle / (Math.PI * 2);
    const nextSeconds = Math.round(currentStep.durationSeconds * (1 - progress));

    state.remainingStepSeconds = Math.max(0, Math.min(currentStep.durationSeconds, nextSeconds));
    renderTimer(elements, state);
}

function updateMobileScrub(event, elements, state) {
    const preset = timerPresets[state.activeRecipeId];
    const currentStep = preset.steps[state.currentStepIndex];
    const rect = elements.mobileBar.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const progress = rect.width ? relativeX / rect.width : 0;
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const nextSeconds = Math.round(currentStep.durationSeconds * (1 - clampedProgress));

    state.remainingStepSeconds = Math.max(0, Math.min(currentStep.durationSeconds, nextSeconds));
    renderTimer(elements, state);
}

function stopPointerDrag(state) {
    state.pointerDrag = null;
}

function scheduleWindowPosition(elements, state) {
    if (state.frameId) {
        return;
    }

    state.frameId = requestAnimationFrame(() => {
        state.frameId = null;
        applyWindowPosition(elements, state);
    });
}

function applyWindowPosition(elements, state) {
    if (isMobileView()) {
        elements.root.style.left = '';
        elements.root.style.top = '';
        return;
    }

    const rootRect = elements.root.getBoundingClientRect();
    const maxX = Math.max(12, window.innerWidth - rootRect.width - 12);
    const maxY = Math.max(12, window.innerHeight - rootRect.height - 12);
    const safeX = Math.min(Math.max(12, state.position.x), maxX);
    const safeY = Math.min(Math.max(12, state.position.y), maxY);

    state.position.x = safeX;
    state.position.y = safeY;
    elements.root.style.left = `${safeX}px`;
    elements.root.style.top = `${safeY}px`;
}

function showNotification(elements, message) {
    const toast = document.createElement('div');

    toast.className = 'cooking-timer-toast';
    toast.textContent = message;
    elements.toasts.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('is-visible');
    });

    setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => {
            toast.remove();
        }, 280);
    }, 2400);
}

function getActiveRecipeId() {
    const recipeRoot = getElement('#active-recipe');

    return recipeRoot?.dataset.recipeId || 'lemon-garlic-chicken';
}

function isMobileView() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
