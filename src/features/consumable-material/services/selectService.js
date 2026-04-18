export async function getStateTypes() {
    const response = await fetch("/../../data/selects/state.json")
    return response.json();
}