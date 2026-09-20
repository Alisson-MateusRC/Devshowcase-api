class FeedbackOutputDTO {
    constructor(feedback) {
        this.id = feedback.id;
        this.comment = feedback.comment;
        this.rating = feedback.rating;
        this.projectId = feedback.projectId;
    }
}

module.exports = FeedbackOutputDTO;