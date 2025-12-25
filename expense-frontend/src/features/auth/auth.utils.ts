export const getStoredAuth = () => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    return {
        token: token,
        user: user ? JSON.parse(user) : null
    }
}