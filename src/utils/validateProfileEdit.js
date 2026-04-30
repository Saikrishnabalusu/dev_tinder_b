

const validateProfileEdit = (req) => {
    const allowedFields = ["firstName", "lastName", "gender", "age", "skills", "profileUrl", "about"];
    const isEditFieldsAllowed = Object.keys(req.body).every((key) => allowedFields.includes(key))


    if (!isEditFieldsAllowed) {
        throw new Error("Unsupported Fields found for edit!!")
    }
    console.log("validated profile Edit data")
}

module.exports = validateProfileEdit;