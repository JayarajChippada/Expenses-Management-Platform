export const validateEmail = (email: string) => {
  const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegExp.test(email)) {
    return "Please provide a valid email address";
  }
  return null;
};

export const validatePassword = (password: string) => {
  const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  if (!passwordRegExp.test(password)) {
    return "Password must be 8-20 characters long and include uppercase, lowercase, number, and special character";
  }
  return null;
};

export const validateName = (name: string) => {
  const nameRegExp = /^[A-Za-z][A-za-z]{1,49}$/;
  if (!nameRegExp.test(name)) {
    return "Name must contain only letters and be 2 to 50 characters long";
  }
  return null;
};
