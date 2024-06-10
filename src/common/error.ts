export const errorMessage = (message : string) => {
        alert(message);
        throw new Error(message);
}