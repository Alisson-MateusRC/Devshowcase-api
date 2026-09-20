class ProjectOutputDTO {
    constructor(project) {
        this.id = project.id;
        this.title = project.title;
        this.description = project.description;
        this.url = project.url;
        this.profileId = project.profileId;

        this.technologies = project.technologies
            ? project.technologies.map(technology => ({
                id: technology.id,
                name: technology.name
            }))
            : [];

        this.feedbacks = project.feedbacks
            ? project.feedbacks.map(feedback => ({
                id: feedback.id,
                comment: feedback.comment,
                rating: feedback.rating
            }))
            : [];
    }
}

module.exports = ProjectOutputDTO;