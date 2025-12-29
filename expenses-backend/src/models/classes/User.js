class User {
  constructor(obj) {
    this.fullName = obj.fullName;
    this.email = obj.email;
    this.password = obj.password;
    this.profilePicture = obj.profilePicture;
    this.currency = obj.currency;
    this.timeZone = obj.timeZone;
  }
}

module.exports = User;
