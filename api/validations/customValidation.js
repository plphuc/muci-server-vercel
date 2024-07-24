const checkPassword = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('Password must be at least 8 characters')
  }
  if (!value.match(/[a-z]/g)) {
    return helpers.message('Must contain lowercase letter');
  }
  if (!value.match(/[A-Z]/g)) {
    return helpers.message('Must contain uppercase letter');
  }
  if (!value.match(/[!@#\$%\^\&*\)\(\/><"':;,|\\\]\[{}?+=._-]/g)) {
    return helpers.message('Must contain special character');
  }

  return value
}

export {
  checkPassword
}