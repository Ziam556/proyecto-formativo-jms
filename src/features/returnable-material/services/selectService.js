export async function getDimensionsTypes() {
    const response = await fetch("/../../data/selects/dimensions.json")
    return response.json();
}

export async function getCategoriesTypes() {
    const response = await fetch("/../../data/selects/categories.json")
    return response.json();
}

export async function getStateTypes() {
    const response = await fetch("/../../data/selects/state.json")
    return response.json();
}