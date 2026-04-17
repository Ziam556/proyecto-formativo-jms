export async function getDocumentTypes() {

    const response = await fetch("/../../data/selects/documentTypes.json")

    return response.json();
    
} 

export async function getUserTypes() {

    const response = await fetch("/../../data/selects/userTypes.json")

    return response.json();
    
} 