/**
 * Melakukan login user (mock implementation).
 * @param {string} email - Email user
 * @param {string} password - Password user
 * @returns {Promise<Object>} Hasil login dengan status dan data user
 */
export const loginUser = async (email, password) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, user: { name: "Petani Cerdas", email: email } });
        }, 1000);
    });
};
