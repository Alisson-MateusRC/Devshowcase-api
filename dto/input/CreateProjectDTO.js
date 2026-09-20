class CreateProjectDTO {
    constructor({ title, description, url, profileId, technologyIds }) {
        this.title = title;
        this.description = description;
        this.url = url;
        this.profileId = profileId;
        this.technologyIds = technologyIds;
    }
}

module.exports = CreateProjectDTO;