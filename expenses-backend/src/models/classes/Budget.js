class Budget {
  constructor(obj) {
    this.userId = obj.userId;

    this.categoryName = obj.categoryName;

    this.budgetAmount = obj.budgetAmount;

    this.amountSpent = obj.amountSpent;

    this.period = obj.period;

    this.alertThreshold = obj.alertThreshold;

    this.isActive = obj.isActive;
  }
}

module.exports = Budget;
