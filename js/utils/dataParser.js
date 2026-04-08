export function formatDate(dateString) {
    try {
        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return 'Date unavailable';
        }

        return date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'Date unavailable';
    }
}

export function truncateText(text, maxLength, useWordBoundary = true) {
    if (!text || text.length <= maxLength) {
        return text || '';
    }

    let truncated = text.slice(0, maxLength);

    if (useWordBoundary) {
        truncated = truncated.slice(0, Math.min(truncated.length, truncated.lastIndexOf(' ')));
    }

    return `${truncated}...`;
}

export function splitInstructions(text) {
    const normalizedText = String(text || '').replace(/\r/g, '\n').trim();

    if (!normalizedText) {
        return [];
    }

    const paragraphs = normalizedText
        .split(/\n+/)
        .map((item) => item.trim().replace(/^\d+[\).\s-]+/, ''))
        .filter(Boolean);

    if (paragraphs.length > 1) {
        return paragraphs;
    }

    const sentences = normalizedText
        .split(/(?<=[.!?])\s+/)
        .map((item) => item.trim().replace(/^\d+[\).\s-]+/, ''))
        .filter(Boolean);

    if (sentences.length <= 2) {
        return sentences.length ? sentences : [normalizedText];
    }

    const groupedSteps = [];

    for (let index = 0; index < sentences.length; index += 2) {
        groupedSteps.push(sentences.slice(index, index + 2).join(' '));
    }

    return groupedSteps;
}

export function createRecipeSummary(text, maxLength = 220) {
    const [firstStep = ''] = splitInstructions(text);
    return truncateText(firstStep || text || '', maxLength);
}

export function createElementFromData(data, template) {
    try {
        let html = template;

        Object.keys(data).forEach((key) => {
            const placeholder = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(placeholder, data[key] ?? '');
        });

        const templateElement = document.createElement('template');
        templateElement.innerHTML = html.trim();
        return templateElement.content.firstElementChild;
    } catch (error) {
        console.error('Error creating element from template:', error);
        return document.createElement('div');
    }
}

export function parseMealData(meal) {
    const ingredients = [];

    for (let index = 1; index <= 20; index += 1) {
        const ingredient = meal[`strIngredient${index}`]?.trim();
        const measure = meal[`strMeasure${index}`]?.trim();

        if (ingredient) {
            ingredients.push(measure ? `${measure} ${ingredient}`.trim() : ingredient);
        }
    }

    const instructions = meal.strInstructions || '';
    const instructionSteps = splitInstructions(instructions);

    return {
        id: meal.idMeal,
        title: meal.strMeal,
        category: meal.strCategory || 'Recipe',
        area: meal.strArea || 'International',
        instructions,
        instructionSteps,
        description: createRecipeSummary(instructions, 260) || 'No description available for this recipe yet.',
        image: meal.strMealThumb || '',
        ingredients,
        source: meal.strSource || '',
        youtube: meal.strYoutube || '',
    };
}

export function parseMealsResponse(data) {
    if (!data?.meals || !Array.isArray(data.meals)) {
        return [];
    }

    return data.meals.map(parseMealData);
}
