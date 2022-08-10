module.exports.validateRegisterInput = (
  userName,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (userName.trim() === '') {
    errors.userName = 'UserName Must Not Be Empty';
  }
  if (email.trim() === '') {
    errors.email = 'Email Must Not Be Empty';
  } else {
    const emailRegEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(emailRegEx)) {
      errors.email = 'Email must be a valid email address';
    }
  }
  if (password.length < 6) {
    errors.password =
      'Password Must Not Be Empty, At least 6 characters required';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
//validation for login credentials
module.exports.validateLoginInput = (userName, password) => {
  const errors = {};
  if (userName.trim() === '') {
    errors.userName = 'Username must not be empty';
  }
  if (password.trim() === '') {
    errors.password = 'Password must not be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
