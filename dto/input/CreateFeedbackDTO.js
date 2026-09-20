class CreateFeedbackDTO {
    constructor({ comment, rating, projectId }) {
        this.comment = comment;
        this.rating = rating;
        this.projectId = projectId;
    }
}

module.exports = CreateFeedbackDTO;