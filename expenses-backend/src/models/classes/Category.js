class Category {
  constructor(obj) {
    this.userId = obj.userId;
    this.categoryName = obj.categoryName;
    this.type = obj.type;
    this.color = obj.color;
    this.icon = obj.icon;
    this.keywords = obj.keywords;
  }
}

module.exports = Category;
