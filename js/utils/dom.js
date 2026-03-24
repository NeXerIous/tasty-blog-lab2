export function getElement(selector, parent = document) {
    return parent.querySelector(selector);
}

export function getElements(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}

export function createListHTML(items, renderItem = (item) => item, itemAttributes = '') {
    const attributes = itemAttributes ? ` ${itemAttributes}` : '';

    return items
        .map((item, index) => `<li${attributes}>${renderItem(item, index)}</li>`)
        .join('');
}
