export class TooManyMinesError extends Error {
  constructor() {
    super(
      'Too many mines. The number of mines must be smaller than the number of cells.',
    );
  }
}
