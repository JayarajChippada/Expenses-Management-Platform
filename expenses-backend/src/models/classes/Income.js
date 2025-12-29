class Income {
    constructor(obj) {
        this.userId = obj.userId;
        this.source = obj.source;
        this.categoryName = obj.categoryName;
        this.amount = Number(obj.amount);
        this.paymentMethod = obj.paymentMethod;
        this.date = obj.date ? new Date(obj.date) : null;
        this.notes = obj.notes;
    }
}

module.exports = Income;
