export var ValueError = class extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValueError';
  }
};
