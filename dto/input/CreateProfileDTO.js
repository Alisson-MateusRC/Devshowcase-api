class CreateProfileDTO {
    constructor({ name, email, bio }) {
        this.name = name;
        this.email = email;
        this.bio = bio;
    }
}

module.exports = CreateProfileDTO;