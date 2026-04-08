import { createListHTML, getElement } from '../utils/dom.js';

const recipes = {
    'lemon-garlic-chicken': {
        id: 'lemon-garlic-chicken',
        main: {
            badge: 'RECIPE',
            title: 'LEMON GARLIC ROASTED CHICKEN',
            description:
                'Welcome to Cooks Delight, where bright citrus, roasted garlic, and golden chicken come together for a comforting dinner with a bold homemade feel.',
            info: [
                { icon: 'images/clock-icon.svg', text: '1 HOUR' },
                { icon: 'images/difficulty-hard-icon.svg', text: 'HARD PREP' },
                { icon: 'images/dish-icon.svg', text: '4 SERVES', itemprop: 'recipeYield' },
            ],
            image: {
                src: 'images/main-chicken.jpg',
                alt: 'Lemon Garlic Roasted Chicken in a pan',
            },
            introParagraphs: [
                "Picture succulent chicken infused with bright lemon notes and the rich aroma of garlic. It is a simple centerpiece with enough flavor to feel special at the table.",
                'As the chicken roasts, the kitchen fills with herbs and citrus, making the whole meal feel warm and inviting. This recipe is easy to dress up for guests, but still friendly enough for a family dinner.',
            ],
            tips: {
                title: "Let's go over the basics - the do's, and the don'ts - for how to cook chicken",
                dos: [
                    '<strong>Clean hands and surfaces well:</strong> Wash your hands, utensils, and counters before and after handling raw chicken.',
                    '<strong>Use separate cutting boards:</strong> Keep raw chicken away from produce, bread, and anything that will not be cooked again.',
                    '<strong>Check the internal temperature:</strong> Cook chicken until it reaches 165&deg;F (74&deg;C) in the thickest part.',
                ],
                donts: [
                    '<strong>Do not thaw chicken at room temperature:</strong> Let it thaw in the refrigerator to keep it safe.',
                    '<strong>Do not crowd the roasting pan:</strong> Give the chicken space so the heat can circulate evenly.',
                ],
            },
            instructions: {
                title: 'Instructions',
                introParagraphs: [
                    'This version of roast chicken keeps the ingredient list approachable while still layering in plenty of flavor. Lemon, garlic, and herbs carry the whole dish.',
                    'Let the chicken rest before carving so the juices settle back into the meat. That short pause makes every slice more tender and easier to serve.',
                ],
                steps: [
                    {
                        title: 'Preheat and Prepare',
                        listType: 'ul',
                        itemprop: 'recipeInstructions',
                        items: [
                            'Preheat the oven to 375&deg;F (190&deg;C).',
                            'Rinse the chicken, then pat it dry with paper towels.',
                        ],
                    },
                    {
                        title: 'Citrus Infusion',
                        listType: 'ul',
                        itemprop: 'recipeInstructions',
                        items: [
                            'Loosen the skin gently and rub minced garlic under it.',
                            'Slide lemon slices beneath the skin to perfume the meat as it roasts.',
                        ],
                        image: {
                            src: 'images/step-two-chicken.jpg',
                            alt: 'Citrus infused chicken before roasting',
                        },
                    },
                    {
                        title: 'Herb Blend',
                        listType: 'ul',
                        itemprop: 'recipeInstructions',
                        items: [
                            'Mix olive oil, thyme, rosemary, salt, and black pepper in a small bowl.',
                            'Brush the herb mixture over the entire chicken.',
                            'Season again lightly if needed for a fuller crust.',
                        ],
                        image: {
                            src: 'images/step-three-chicken.jpg',
                            alt: 'Chicken coated with an herb blend',
                        },
                    },
                    {
                        title: 'Roast to Perfection',
                        listType: 'ul',
                        itemprop: 'recipeInstructions',
                        items: [
                            'Place the chicken breast side up in a roasting pan.',
                            'Roast for about 1 hour, or until the center reaches 165&deg;F (74&deg;C).',
                            'Rest the chicken for 10 minutes before carving.',
                            'Serve with pan juices and roasted lemon slices.',
                        ],
                        image: {
                            src: 'images/step-four-chicken.jpg',
                            alt: 'Roasted chicken ready to serve',
                        },
                    },
                    {
                        title: 'Pairing Suggestions',
                        listType: 'ol',
                        items: [
                            'Serve with roasted vegetables or a crisp green salad.',
                            'Pair with a chilled white wine or a dry rose.',
                        ],
                        paragraphs: [
                            '<strong>Roasted vegetables:</strong> Sweet carrots, potatoes, and onions round out the dish without competing with the chicken.',
                            '<strong>Herb quinoa:</strong> A light grain side keeps the meal balanced and adds a fresh finish.',
                            'The combination of lemon and garlic keeps this recipe bright, savory, and easy to repeat whenever you need a dependable main course.',
                        ],
                    },
                ],
            },
        },
        sidebar: {
            ingredientsTitle: 'ingredients',
            ingredients: [
                '1 whole chicken (about 3-4 pounds)',
                '2 lemons, sliced',
                '6 cloves garlic, minced',
                '2 tablespoons olive oil',
                '1 teaspoon dried thyme',
                '1 teaspoon dried rosemary',
                'Salt and black pepper to taste',
            ],
            equipmentTitle: 'Equipment Needed for Preparation',
            equipment: ['Meat thermometer', 'Roasting pan', 'Cutting board', 'Kitchen twine'],
            nutritionTitle: 'Nutritional Value',
            nutritionLead: 'Per serving (based on a 4-pound chicken):',
            nutrition: [
                { label: 'Calories', value: '~250', itemprop: 'calories' },
                { label: 'Protein', value: '~30g', itemprop: 'proteinContent' },
                { label: 'Total Fat', value: '~13g', itemprop: 'fatContent' },
                { label: 'Carbohydrates', value: '~5g', itemprop: 'carbohydrateContent' },
            ],
            note: 'Note: Nutritional values are approximate and may vary based on specific ingredients and portion sizes.',
        },
        card: {
            title: 'Lemon Garlic Roasted Chicken',
            description:
                'A bright, savory roast chicken with garlic, herbs, and citrus tucked under the skin.',
            meta: '1 HOUR - HARD PREP - 4 SERVES',
            image: {
                src: 'images/main-chicken.jpg',
                alt: 'Lemon Garlic Roasted Chicken in a pan',
            },
        },
    },
    'savory-herb-chicken': {
        id: 'savory-herb-chicken',
        main: {
            badge: 'RECIPE',
            title: 'SAVORY HERB-INFUSED CHICKEN',
            description:
                'This herb-forward roast chicken leans into rosemary, thyme, and garlic for a rich savory flavor that feels cozy and classic.',
            info: [
                { icon: 'images/clock-icon.svg', text: '40 MIN' },
                { icon: 'images/difficulty-hard-icon.svg', text: 'EASY PREP' },
                { icon: 'images/dish-icon.svg', text: '3 SERVES', itemprop: 'recipeYield' },
            ],
            image: {
                src: 'images/similar-chicken.jpg',
                alt: 'Savory Herb-Infused Chicken on a plate',
            },
            introParagraphs: [
                'If you love the deeper side of roast chicken, this version keeps the lemon subtle and lets herbs lead the flavor. The result is comforting, aromatic, and beautifully golden.',
                'A quick herb paste does most of the work here, making this recipe easy enough for a weeknight but still polished enough for a shared table on the weekend.',
            ],
            tips: {
                title: "Let's go over the basics - the do's, and the don'ts - for herb roasted chicken",
                dos: [
                    '<strong>Dry the chicken well:</strong> Removing surface moisture helps the skin roast instead of steam.',
                    '<strong>Massage the seasoning evenly:</strong> Spread the herb mixture over every part of the chicken for balanced flavor.',
                    '<strong>Use fresh herbs when possible:</strong> Fresh rosemary and thyme make the aroma stronger and cleaner.',
                ],
                donts: [
                    '<strong>Do not skip the resting step:</strong> Resting keeps the meat juicy and easier to carve.',
                    '<strong>Do not over-season with salt at the end:</strong> Taste pan juices first before adding extra seasoning.',
                ],
            },
            instructions: {
                title: 'Instructions',
                introParagraphs: [
                    'This chicken is all about an even coating of herbs and a steady roast. It is a good example of how a short ingredient list can still produce a full, savory finish.',
                    'Keep the method simple and let the herb crust and roasting juices do the work. A little patience in the oven gives you the best texture.',
                ],
                steps: [
                    {
                        title: 'Build the Herb Paste',
                        listType: 'ul',
                        itemprop: 'recipeInstructions',
                        items: [
                            'Mix olive oil, minced garlic, chopped rosemary, thyme, salt, and black pepper.',
                            'Stir until the herbs are coated and the paste looks glossy.',
                        ],
                    },
                    {
                        title: 'Coat the Chicken',
                        listType: 'ul',
                        itemprop: 'recipeInstructions',
                        items: [
                            'Rub the herb mixture over the chicken, including the top and sides.',
                            'Tuck a few herb sprigs around the pan for extra aroma while roasting.',
                        ],
                        image: {
                            src: 'images/step-two-chicken.jpg',
                            alt: 'Chicken rubbed with an herb seasoning blend',
                        },
                    },
                    {
                        title: 'Roast the Chicken',
                        listType: 'ul',
                        itemprop: 'recipeInstructions',
                        items: [
                            'Roast at 375&deg;F (190&deg;C) until the skin is browned and crisp.',
                            'Baste once or twice with the juices in the pan for extra color.',
                        ],
                        image: {
                            src: 'images/step-three-chicken.jpg',
                            alt: 'Herb chicken roasting in the oven',
                        },
                    },
                    {
                        title: 'Finish and Slice',
                        listType: 'ul',
                        itemprop: 'recipeInstructions',
                        items: [
                            'Rest the chicken for 10 minutes after roasting.',
                            'Slice and spoon the herb juices over each serving.',
                            'Serve with potatoes, rice, or green beans.',
                        ],
                        image: {
                            src: 'images/step-four-chicken.jpg',
                            alt: 'Herb chicken ready to serve',
                        },
                    },
                    {
                        title: 'Pairing Suggestions',
                        listType: 'ol',
                        items: [
                            'Add mashed potatoes or buttered baby potatoes on the side.',
                            'Pair with sparkling water, apple cider, or a light white wine.',
                        ],
                        paragraphs: [
                            '<strong>Pan sauce:</strong> A spoonful of roasting juices adds instant richness to every bite.',
                            '<strong>Fresh greens:</strong> Peppery greens keep the plate from feeling too heavy.',
                            'This version is especially good when you want a savory roast that feels familiar, fragrant, and easy to repeat.',
                        ],
                    },
                ],
            },
        },
        sidebar: {
            ingredientsTitle: 'ingredients',
            ingredients: [
                '1 small whole chicken',
                '3 tablespoons olive oil',
                '4 cloves garlic, minced',
                '1 tablespoon fresh rosemary, chopped',
                '1 tablespoon fresh thyme leaves',
                '1 teaspoon sea salt',
                '1/2 teaspoon black pepper',
            ],
            equipmentTitle: 'Equipment Needed for Preparation',
            equipment: ['Mixing bowl', 'Roasting dish', 'Basting spoon', 'Chef knife'],
            nutritionTitle: 'Nutritional Value',
            nutritionLead: 'Per serving (based on a 3-serving chicken roast):',
            nutrition: [
                { label: 'Calories', value: '~280', itemprop: 'calories' },
                { label: 'Protein', value: '~27g', itemprop: 'proteinContent' },
                { label: 'Total Fat', value: '~16g', itemprop: 'fatContent' },
                { label: 'Carbohydrates', value: '~3g', itemprop: 'carbohydrateContent' },
            ],
            note: 'Note: Herb amounts can be adjusted depending on whether you use fresh or dried seasoning.',
        },
        card: {
            title: 'Savory Herb-Infused Chicken',
            description:
                'A deeply savory roast chicken built around rosemary, thyme, and a quick herb crust.',
            meta: '40 MIN - EASY PREP - 3 SERVES',
            image: {
                src: 'images/similar-chicken.jpg',
                alt: 'Savory Herb-Infused Chicken',
            },
        },
    },
    'decadent-chocolate-mousse': {
        id: 'decadent-chocolate-mousse',
        main: {
            badge: 'RECIPE',
            title: 'DECADENT CHOCOLATE MOUSSE',
            description:
                'Silky, airy, and deeply chocolatey, this mousse turns a few simple ingredients into a dessert that feels elegant without being difficult.',
            info: [
                { icon: 'images/clock-icon.svg', text: '30 MIN' },
                { icon: 'images/difficulty-hard-icon.svg', text: 'MEDIUM PREP' },
                { icon: 'images/dish-icon.svg', text: '4 SERVES', itemprop: 'recipeYield' },
            ],
            image: {
                src: 'images/similar-mousse.jpg',
                alt: 'Decadent Chocolate Mousse in serving glasses',
            },
            introParagraphs: [
                'Chocolate mousse is the kind of dessert that feels special from the first spoonful. It is light enough to finish a meal, but rich enough to still feel indulgent.',
                'This version focuses on texture: smooth melted chocolate, gentle folding, and enough chill time to help the mousse set into soft, airy layers.',
            ],
            tips: {
                title: "Let's go over the basics - the do's, and the don'ts - for a smooth chocolate mousse",
                dos: [
                    '<strong>Let the chocolate cool slightly:</strong> Warm chocolate mixes more smoothly and will not scramble the rest of the ingredients.',
                    '<strong>Fold gently:</strong> Slow folds keep the mousse airy instead of dense.',
                    '<strong>Chill before serving:</strong> Time in the refrigerator helps the texture settle and makes the dessert taste richer.',
                ],
                donts: [
                    '<strong>Do not overmix:</strong> Too much stirring knocks out the air and makes the mousse heavy.',
                    '<strong>Do not rush the chill time:</strong> Serving too early can leave the mousse too soft.',
                ],
            },
            instructions: {
                title: 'Instructions',
                introParagraphs: [
                    'This dessert is mostly about patience and texture. Once the chocolate is melted and the mixture is folded together, the refrigerator does the rest.',
                    'Serve it plain, or top it with fruit, shaved chocolate, or a pinch of flaky salt if you want a sharper finish.',
                ],
                steps: [
                    {
                        title: 'Melt the Chocolate',
                        listType: 'ul',
                        itemprop: 'recipeInstructions',
                        items: [
                            'Melt the chocolate slowly over a double boiler or in short microwave bursts.',
                            'Stir until smooth, then let it cool for a few minutes.',
                        ],
                        image: {
                            src: 'images/similar-mousse.jpg',
                            alt: 'Melted chocolate prepared for mousse',
                        },
                    },
                    {
                        title: 'Whisk the Base',
                        listType: 'ul',
                        itemprop: 'recipeInstructions',
                        items: [
                            'Whisk together the cream, sweetener, and vanilla until lightly thickened.',
                            'Add the cooled chocolate and stir just until combined.',
                        ],
                        image: {
                            src: 'images/similar-mousse.jpg',
                            alt: 'Chocolate mousse base in a bowl',
                        },
                    },
                    {
                        title: 'Fold and Portion',
                        listType: 'ul',
                        itemprop: 'recipeInstructions',
                        items: [
                            'Fold the mixture gently to keep as much air as possible.',
                            'Spoon it into small glasses or ramekins.',
                        ],
                        image: {
                            src: 'images/similar-mousse.jpg',
                            alt: 'Chocolate mousse portioned into serving glasses',
                        },
                    },
                    {
                        title: 'Chill and Finish',
                        listType: 'ul',
                        itemprop: 'recipeInstructions',
                        items: [
                            'Chill for at least 2 hours before serving.',
                            'Top with berries, cocoa powder, or chocolate curls if desired.',
                        ],
                    },
                    {
                        title: 'Pairing Suggestions',
                        listType: 'ol',
                        items: [
                            'Serve with fresh strawberries or raspberries for contrast.',
                            'Pair with coffee, espresso, or a small glass of dessert wine.',
                        ],
                        paragraphs: [
                            '<strong>Texture contrast:</strong> A crisp cookie or wafer alongside the mousse makes each bite feel more layered.',
                            '<strong>Fresh garnish:</strong> Mint or citrus zest keeps the dessert from feeling too heavy.',
                            'This mousse works well as a make-ahead dessert because the flavor deepens as it chills.',
                        ],
                    },
                ],
            },
        },
        sidebar: {
            ingredientsTitle: 'ingredients',
            ingredients: [
                '200 g dark chocolate',
                '1 cup chilled cream',
                '2 tablespoons maple syrup',
                '1 teaspoon vanilla extract',
                'Pinch of salt',
                'Fresh berries for topping',
            ],
            equipmentTitle: 'Equipment Needed for Preparation',
            equipment: ['Heatproof bowl', 'Whisk', 'Rubber spatula', 'Serving glasses'],
            nutritionTitle: 'Nutritional Value',
            nutritionLead: 'Per serving (based on 4 dessert cups):',
            nutrition: [
                { label: 'Calories', value: '~320', itemprop: 'calories' },
                { label: 'Protein', value: '~4g', itemprop: 'proteinContent' },
                { label: 'Total Fat', value: '~24g', itemprop: 'fatContent' },
                { label: 'Carbohydrates', value: '~20g', itemprop: 'carbohydrateContent' },
            ],
            note: 'Note: The vegan badge applies when you use dairy-free cream and chocolate without milk solids.',
        },
        card: {
            title: 'Decadent Chocolate Mousse',
            description:
                'A smooth chocolate dessert with an airy texture and a clean, elegant finish.',
            meta: '30 MIN - MEDIUM PREP - 4 SERVES',
            image: {
                src: 'images/similar-mousse.jpg',
                alt: 'Decadent Chocolate Mousse',
            },
            badgeImage: {
                src: 'images/vegan-badge.svg',
                alt: 'Vegan friendly',
            },
        },
    },
};

const state = {
    activeRecipeId: 'lemon-garlic-chicken',
    cardRecipeIds: ['savory-herb-chicken', 'decadent-chocolate-mousse'],
};

export function initRecipeTabs() {
    const recipeRoot = getElement('#active-recipe');
    const cardsRoot = getElement('[data-recipe-cards]');

    if (!recipeRoot || !cardsRoot) {
        return;
    }

    const elements = {
        root: recipeRoot,
        badge: getElement('[data-recipe-badge]', recipeRoot),
        title: getElement('[data-recipe-title]', recipeRoot),
        description: getElement('[data-recipe-description]', recipeRoot),
        info: getElement('[data-recipe-info]', recipeRoot),
        image: getElement('[data-recipe-image]', recipeRoot),
        content: getElement('[data-recipe-content]', recipeRoot),
        sidebar: getElement('[data-recipe-sidebar]', recipeRoot),
    };

    renderMainRecipe(recipes[state.activeRecipeId], elements);
    renderRecipeCards(state.cardRecipeIds, cardsRoot);
    dispatchRecipeChange(state.activeRecipeId);

    cardsRoot.addEventListener('click', (event) => {
        handleRecipeSelect(event, elements, cardsRoot);
    });
}

function handleRecipeSelect(event, elements, cardsRoot) {
    const trigger = event.target.closest('[data-recipe-trigger]');

    if (!trigger) {
        return;
    }

    const clickedRecipeId = trigger.dataset.recipeId;
    const slotIndex = Number(trigger.dataset.slot);

    if (!clickedRecipeId || Number.isNaN(slotIndex) || clickedRecipeId == state.activeRecipeId) {
        return;
    }

    const previousActiveId = state.activeRecipeId;

    state.activeRecipeId = clickedRecipeId;
    state.cardRecipeIds[slotIndex] = previousActiveId;

    renderMainRecipe(recipes[state.activeRecipeId], elements);
    renderRecipeCards(state.cardRecipeIds, cardsRoot);
    dispatchRecipeChange(state.activeRecipeId);
    scrollToPageTop();
}

function renderMainRecipe(recipe, elements) {
    elements.root.dataset.recipeId = recipe.id;
    elements.badge.textContent = recipe.main.badge;
    elements.title.textContent = recipe.main.title;
    elements.description.textContent = recipe.main.description;
    elements.info.innerHTML = buildRecipeInfoHTML(recipe.main.info);
    elements.image.src = recipe.main.image.src;
    elements.image.alt = recipe.main.image.alt;
    elements.content.innerHTML = buildRecipeContentHTML(recipe);
    elements.sidebar.innerHTML = buildSidebarHTML(recipe.sidebar);
}

function renderRecipeCards(cardRecipeIds, cardsRoot) {
    cardsRoot.innerHTML = cardRecipeIds
        .map((recipeId, index) => buildRecipeCardHTML(recipes[recipeId], index))
        .join('');
}

function buildRecipeInfoHTML(infoItems) {
    return infoItems
        .map((item) => {
            const itemprop = item.itemprop ? ` itemprop="${item.itemprop}"` : '';

            return `
                <li class="recipe-info-item">
                    <img src="${item.icon}" alt="">
                    <span${itemprop}>${item.text}</span>
                </li>
            `;
        })
        .join('');
}

function buildRecipeContentHTML(recipe) {
    const introParagraphsHTML = recipe.main.introParagraphs
        .map((paragraph) => `<p>${paragraph}</p>`)
        .join('');

    const instructionsIntroHTML = recipe.main.instructions.introParagraphs
        .map((paragraph) => `<p>${paragraph}</p>`)
        .join('');

    const instructionsStepsHTML = recipe.main.instructions.steps.map(buildInstructionStepHTML).join('');

    return `
        ${introParagraphsHTML}

        <section>
            <h2 class="tips-main-title">${recipe.main.tips.title}</h2>

            <h3 class="tips-subtitle">DO'S:</h3>
            <ul class="tips-list">
                ${createListHTML(recipe.main.tips.dos)}
            </ul>

            <h3 class="tips-subtitle">DON'TS:</h3>
            <ul class="tips-list">
                ${createListHTML(recipe.main.tips.donts)}
            </ul>
        </section>

        <section>
            <h2 class="instructions-title">${recipe.main.instructions.title}</h2>
            ${instructionsIntroHTML}
            ${instructionsStepsHTML}
        </section>
    `;
}

function buildInstructionStepHTML(step) {
    const listTag = step.listType || 'ul';
    const listAttributes = step.itemprop ? `itemprop="${step.itemprop}"` : '';
    const listHTML = step.items?.length
        ? `<${listTag}>${createListHTML(step.items, (item) => item, listAttributes)}</${listTag}>`
        : '';
    const paragraphsHTML = step.paragraphs?.length
        ? step.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')
        : '';
    const imageHTML = step.image
        ? `<img src="${step.image.src}" alt="${step.image.alt}">`
        : '';

    return `
        <div class="instructions-step">
            <h3 class="step-title">${step.title}</h3>
            ${listHTML}
            ${paragraphsHTML}
            ${imageHTML}
        </div>
    `;
}

function buildSidebarHTML(sidebar) {
    const ingredientsHTML = createListHTML(
        sidebar.ingredients,
        (item) => item,
        'itemprop="recipeIngredient"'
    );

    const equipmentHTML = createListHTML(sidebar.equipment);

    const nutritionHTML = sidebar.nutrition
        .map(
            (item) => `
                <li>${item.label}: <span itemprop="${item.itemprop}">${item.value}</span></li>
            `
        )
        .join('');

    return `
        <section class="ingredients-box">
            <h2>${sidebar.ingredientsTitle}</h2>
            <ul class="ingredients-list">
                ${ingredientsHTML}
            </ul>
        </section>

        <section class="equipment-box">
            <h2>${sidebar.equipmentTitle}</h2>
            <ul class="equipment-list">
                ${equipmentHTML}
            </ul>
        </section>

        <section class="value-box" itemprop="nutrition" itemscope itemtype="https://schema.org/NutritionInformation">
            <h2>${sidebar.nutritionTitle}</h2>
            <span class="value-amount">${sidebar.nutritionLead}</span>
            <ul class="value-list">
                ${nutritionHTML}
            </ul>
        </section>

        <p class="recipe-sidebar-note">${sidebar.note}</p>
    `;
}

function buildRecipeCardHTML(recipe, slotIndex) {
    const badgeHTML = recipe.card.badgeImage
        ? `<img src="${recipe.card.badgeImage.src}" alt="${recipe.card.badgeImage.alt}" class="badge-vegan">`
        : '';

    return `
        <article class="recipe-card" data-slot="${slotIndex}" data-recipe-id="${recipe.id}">
            <div class="image-wrapper">
                <img src="${recipe.card.image.src}" alt="${recipe.card.image.alt}" class="recipe-card__image">
                ${badgeHTML}
            </div>
            <div class="recipe-card__content">
                <h3 class="recipe-card__title">${recipe.card.title}</h3>
                <p class="recipe-card__desc">${recipe.card.description}</p>
                <div class="recipe-card__meta">
                    <span class="meta-info">${recipe.card.meta}</span>
                    <button
                        type="button"
                        class="btn--outline"
                        data-recipe-trigger
                        data-recipe-id="${recipe.id}"
                        data-slot="${slotIndex}"
                        aria-label="View ${recipe.card.title} recipe"
                    >
                        VIEW RECIPE
                    </button>
                </div>
            </div>
        </article>
    `;
}

function scrollToPageTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}

function dispatchRecipeChange(recipeId) {
    document.dispatchEvent(
        new CustomEvent('recipechange', {
            detail: { recipeId },
        })
    );
}
