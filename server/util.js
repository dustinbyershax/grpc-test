const getName = (call, type) => {
  const names = call.request.getGreeting();

  switch (type) {
    case 'first':
      return names.getFirstName();
    case 'last':
      return names.getLastName();
    case 'full':
      return `${names.getFirstName()} ${names.getLastName()}`;
    default:
      throw new Error('invalid name format');
  }

}

module.exports = { getName };