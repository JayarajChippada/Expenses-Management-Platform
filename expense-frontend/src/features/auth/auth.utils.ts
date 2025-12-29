export const getStoredAuth = () => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    try {
        return {
            token: token,
            user: user ? JSON.parse(user) : null
        }
    } catch (error) {
        console.error("Error parsing stored auth data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return {
            token: null,
            user: null
        }
    }
}