const isInputValid = (value: string) => {
  return value.length > 5 && value.length < 21;
};

export default isInputValid;
