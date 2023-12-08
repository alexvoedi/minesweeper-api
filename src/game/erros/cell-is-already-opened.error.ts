export class CellIsAlreadyOpenedError extends Error {
  constructor() {
    super(
      'Cell is already opened. You can only open closed cells without flag.',
    );
  }
}
