import { Id } from '../types/Id';

export class GameNotFoundError extends Error {
  constructor(id: Id) {
    super(`Game with ID ${id} not found.`);
  }
}
