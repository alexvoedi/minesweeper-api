export class NotImplementedError extends Error {
  constructor() {
    super('Tried to call not implemented function. We are working on it!');
  }
}
