import ky from "ky";

export async function getAllCategories() {
    try {
        const res = await ky.get('/api/categories').json();

        return res
    } catch (error) {
        return {
            success: false,
            message: error.message,
        }
    }
}