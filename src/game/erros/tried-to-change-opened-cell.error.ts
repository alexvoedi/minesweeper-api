export class TriedToChangeOpenedCellError extends Error {
  constructor() {
    super('Tried to change opened cell. You can not change opened cells.');
  }
}
