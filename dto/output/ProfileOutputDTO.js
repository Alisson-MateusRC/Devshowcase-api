class ProfileOutputDTO {
    constructor(profile) {
        this.id = profile.id;
        this.name = profile.name;
        this.email = profile.email;
        this.bio = profile.bio;
    }
}

module.exports = ProfileOutputDTO;