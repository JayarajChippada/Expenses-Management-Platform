class Goal {
  constructor(obj) {
    this.userId = obj.userId;

    this.categoryName = obj.categoryName;

    this.title = obj.title;

    this.description = obj.description;

    this.targetAmount = obj.targetAmount;

    this.currentAmount = obj.currentAmount;

    this.targetDate = obj.targetDate;

    this.status = obj.status;

    this.priority = obj.priority;
  }
}

module.exports = Goal;
