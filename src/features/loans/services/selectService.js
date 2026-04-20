export async function getMaterialsTypes() {
    const response = await fetch("/../../data/selects/materialsTypes.json")
    return response.json();
}