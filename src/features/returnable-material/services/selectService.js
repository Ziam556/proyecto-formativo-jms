export async function getDimensionsTypes() {
    const response = await fetch("/../../data/selects/dimensions.json")
    return response.json();
}