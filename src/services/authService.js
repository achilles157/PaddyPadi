export const loginUser = async (email, password) => {
    console.log("Attempting login for:", email);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, user: { name: "Petani Cerdas", email: email } });
        }, 1000);
    });
};