import documentTypesData from "../../../../data/selects/documentTypes.json";
import userTypesData from "../../../../data/selects/userTypes.json";

export async function getDocumentTypes() {
    return documentTypesData;
}

export async function getUserTypes() {
    return userTypesData;
}

