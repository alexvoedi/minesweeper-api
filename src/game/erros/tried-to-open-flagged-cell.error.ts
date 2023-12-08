export class TriedToOpenFlaggedCellError extends Error {
  constructor() {
    super('Tried to open flagged cell. You can not open flagged cells.');
  }
}
