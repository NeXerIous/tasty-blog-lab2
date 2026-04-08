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

    return {
        id: meal.idMeal,
        title: meal.strMeal,
        category: meal.strCategory || 'Recipe',
        area: meal.strArea || 'International',
        instructions: meal.strInstructions || '',
        description: meal.strInstructions || 'No description available for this recipe yet.',
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
