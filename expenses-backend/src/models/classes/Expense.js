class Expense {
  constructor(obj) {
    this.userId = obj.userId;

    this.categoryName = obj.categoryName;

    this.amount = Number(obj.amount);

    this.merchant = obj.merchant;

    this.paymentMethod = obj.paymentMethod;

    this.source = obj.source;

    this.date = obj.date ? new Date(obj.date) : null;

    this.notes = obj.notes;
  }
}

module.exports = Expense;
