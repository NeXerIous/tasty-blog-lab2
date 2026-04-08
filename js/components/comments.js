import { getElement } from '../utils/dom.js';

const STORAGE_KEY = 'tastyblog-comments';

const seedComments = {
    'lemon-garlic-chicken': [
        {
            id: 'seed-lc-1',
            recipeId: 'lemon-garlic-chicken',
            name: 'Ava Stone',
            email: 'ava@example.com',
            rating: 5,
            text: 'Bright, juicy, and very easy to follow. The lemon and garlic balance each other really well.',
            createdAt: '2026-03-18T12:00:00.000Z',
            source: 'seed',
        },
        {
            id: 'seed-lc-2',
            recipeId: 'lemon-garlic-chicken',
            name: 'Mason Reed',
            email: 'mason@example.com',
            rating: 4,
            text: 'I made this for dinner and the roasting tips were the most helpful part. Great result with simple ingredients.',
            createdAt: '2026-03-16T12:00:00.000Z',
            source: 'seed',
        },
        {
            id: 'seed-lc-3',
            recipeId: 'lemon-garlic-chicken',
            name: 'Sophia Hall',
            email: 'sophia@example.com',
            rating: 5,
            text: 'The herb mixture and the pan juices made this recipe feel much more special than a usual roast chicken.',
            createdAt: '2026-03-14T12:00:00.000Z',
            source: 'seed',
        },
    ],
    'savory-herb-chicken': [
        {
            id: 'seed-sh-1',
            recipeId: 'savory-herb-chicken',
            name: 'Liam Carter',
            email: 'liam@example.com',
            rating: 5,
            text: 'Perfect for anyone who likes a more savory profile. The herb crust came out fragrant and crisp.',
            createdAt: '2026-03-19T12:00:00.000Z',
            source: 'seed',
        },
        {
            id: 'seed-sh-2',
            recipeId: 'savory-herb-chicken',
            name: 'Emma Brooks',
            email: 'emma@example.com',
            rating: 4,
            text: 'Very reliable method. I served it with potatoes and it felt like a complete Sunday dinner.',
            createdAt: '2026-03-17T12:00:00.000Z',
            source: 'seed',
        },
    ],
    'decadent-chocolate-mousse': [
        {
            id: 'seed-dm-1',
            recipeId: 'decadent-chocolate-mousse',
            name: 'Noah Bennett',
            email: 'noah@example.com',
            rating: 5,
            text: 'Smooth texture, rich flavor, and it looked elegant in glasses. This would be great for guests.',
            createdAt: '2026-03-20T12:00:00.000Z',
            source: 'seed',
        },
        {
            id: 'seed-dm-2',
            recipeId: 'decadent-chocolate-mousse',
            name: 'Mia Cooper',
            email: 'mia@example.com',
            rating: 4,
            text: 'I liked that it felt indulgent without being heavy. Fresh berries on top were a great finish.',
            createdAt: '2026-03-15T12:00:00.000Z',
            source: 'seed',
        },
        {
            id: 'seed-dm-3',
            recipeId: 'decadent-chocolate-mousse',
            name: 'Ethan Price',
            email: 'ethan@example.com',
            rating: 5,
            text: 'The folding tip helped a lot. It stayed airy after chilling and the chocolate flavor was deep but clean.',
            createdAt: '2026-03-13T12:00:00.000Z',
            source: 'seed',
        },
    ],
};

const recipeTitles = {
    'lemon-garlic-chicken': 'Lemon Garlic Roasted Chicken',
    'savory-herb-chicken': 'Savory Herb-Infused Chicken',
    'decadent-chocolate-mousse': 'Decadent Chocolate Mousse',
};

export function initComments() {
    const section = getElement('.comments-section');
    const form = getElement('[data-comments-form]', section);

    if (!section || !form) {
        return;
    }

    const elements = {
        title: getElement('[data-comments-title]', section),
        subtitle: getElement('[data-comments-subtitle]', section),
        average: getElement('[data-comments-average]', section),
        averageStars: getElement('[data-comments-average-stars]', section),
        count: getElement('[data-comments-count]', section),
        list: getElement('[data-comments-list]', section),
        form,
        ratingText: getElement('[data-rating-text]', form),
        commentLength: getElement('[data-comment-length]', form),
        name: form.elements.namedItem('name'),
        email: form.elements.namedItem('email'),
        comment: form.elements.namedItem('comment'),
        rating: form.elements.namedItem('rating'),
    };

    const state = {
        activeRecipeId: getActiveRecipeId(),
        storedComments: readStoredComments(),
    };

    renderCommentsSection(state, elements);

    document.addEventListener('recipechange', (event) => {
        state.activeRecipeId = event.detail?.recipeId || state.activeRecipeId;
        renderCommentsSection(state, elements);
        resetForm(form, elements);
    });

    form.addEventListener('submit', (event) => {
        handleSubmit(event, state, elements);
    });

    form.addEventListener('input', () => {
        updateCommentLength(elements);
        clearFormValidation(elements);
    });

    form.addEventListener('change', () => {
        updateRatingText(elements);
        clearFormValidation(elements);
    });

    updateCommentLength(elements);
    updateRatingText(elements);
}

function handleSubmit(event, state, elements) {
    event.preventDefault();

    const formData = new FormData(elements.form);
    const newComment = {
        id: createCommentId(),
        recipeId: state.activeRecipeId,
        name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        rating: Number(formData.get('rating')),
        text: String(formData.get('comment') || '').trim(),
        createdAt: new Date().toISOString(),
        source: 'user',
    };

    if (!isCommentValid(newComment, elements)) {
        return;
    }

    if (!state.storedComments[state.activeRecipeId]) {
        state.storedComments[state.activeRecipeId] = [];
    }

    state.storedComments[state.activeRecipeId].unshift(newComment);
    saveStoredComments(state.storedComments);
    renderCommentsSection(state, elements);
    resetForm(elements.form, elements);
}

function renderCommentsSection(state, elements) {
    const comments = getCommentsForRecipe(state.activeRecipeId, state.storedComments);
    const title = recipeTitles[state.activeRecipeId] || 'Current Recipe';
    const averageRating = calculateAverageRating(comments);

    elements.title.textContent = 'Reader Reviews';
    elements.subtitle.textContent = `See what readers think about ${title} and leave your own review.`;
    elements.average.textContent = averageRating.toFixed(1);
    elements.averageStars.textContent = renderStars(Math.round(averageRating));
    elements.count.textContent = `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}`;
    elements.list.innerHTML = comments.length
        ? comments.map(buildCommentCardHTML).join('')
        : '<p class="comments-empty">No comments yet for this recipe. Be the first to share your review.</p>';
}

function getCommentsForRecipe(recipeId, storedComments) {
    const userComments = storedComments[recipeId] || [];
    const defaults = seedComments[recipeId] || [];

    return [...userComments, ...defaults];
}

function calculateAverageRating(comments) {
    if (!comments.length) {
        return 0;
    }

    const total = comments.reduce((sum, comment) => sum + comment.rating, 0);

    return total / comments.length;
}

function buildCommentCardHTML(comment) {
    return `
        <article class="comment-card">
            <div class="comment-card__meta">
                <div>
                    <h3 class="comment-card__author">${escapeHTML(comment.name)}</h3>
                    <p class="comment-card__date">${formatCommentDate(comment.createdAt)}</p>
                </div>
                <span class="comment-card__stars" aria-label="${comment.rating} out of 5 stars">${renderStars(comment.rating)}</span>
            </div>
            <p class="comment-card__text">${escapeHTML(comment.text)}</p>
        </article>
    `;
}

function isCommentValid(comment, elements) {
    const isEmailValid = /\S+@\S+\.\S+/.test(comment.email);

    elements.name.setCustomValidity(comment.name ? '' : 'Please enter your name.');
    elements.email.setCustomValidity(isEmailValid ? '' : 'Please enter a valid email.');
    elements.comment.setCustomValidity(comment.text ? '' : 'Please enter your comment.');

    const hasRating = Number.isInteger(comment.rating) && comment.rating >= 1 && comment.rating <= 5;

    if (!hasRating) {
        elements.ratingText.textContent = 'Please choose a rating before posting.';
        elements.ratingText.style.color = '#ee6352';
    } else {
        elements.ratingText.style.color = '';
    }

    elements.form.reportValidity();

    return Boolean(comment.name && comment.text && isEmailValid && hasRating);
}

function updateCommentLength(elements) {
    const length = elements.comment.value.length;
    const maxLength = Number(elements.comment.maxLength) || 400;

    elements.commentLength.textContent = `${length} / ${maxLength}`;
}

function updateRatingText(elements) {
    const checkedRating = getCheckedRating(elements.form);

    elements.ratingText.style.color = '';
    elements.ratingText.textContent = checkedRating
        ? `${checkedRating} ${checkedRating === 1 ? 'star selected' : 'stars selected'}`
        : 'Select a rating';
}

function clearFormValidation(elements) {
    elements.name.setCustomValidity('');
    elements.email.setCustomValidity('');
    elements.comment.setCustomValidity('');
}

function resetForm(form, elements) {
    form.reset();
    clearFormValidation(elements);
    updateCommentLength(elements);
    updateRatingText(elements);
}

function getCheckedRating(form) {
    const checkedInput = form.querySelector('input[name="rating"]:checked');

    return checkedInput ? Number(checkedInput.value) : 0;
}

function readStoredComments() {
    try {
        const storedValue = localStorage.getItem(STORAGE_KEY);

        return storedValue ? JSON.parse(storedValue) : {};
    } catch (error) {
        return {};
    }
}

function saveStoredComments(comments) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

function getActiveRecipeId() {
    const recipeRoot = getElement('#active-recipe');

    return recipeRoot?.dataset.recipeId || 'lemon-garlic-chicken';
}

function createCommentId() {
    return `comment-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function formatCommentDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

function renderStars(rating) {
    return '★★★★★'.slice(0, rating).padEnd(5, '☆');
}

function escapeHTML(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
