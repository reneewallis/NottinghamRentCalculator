export function getSessionStorageItem<T>(key: string): T | null {
    try {
        const item = sessionStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        } else {
            console.log(`${key} not found in session storage\n`);
        }
    } catch (error) {
        console.log(error);
    }
    return null;
}

export function setSessionStorageItem<T>(key: string, value: T) {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.log(error);
    }
}

export function removeSessionStorageItem(key: string) {
    sessionStorage.removeItem(key);
}
