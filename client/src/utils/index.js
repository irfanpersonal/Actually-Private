export const getThemeFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('theme'));
}

export const setThemeForLocalStorage = (theme) => {
    localStorage.setItem('theme', JSON.stringify(theme));
}