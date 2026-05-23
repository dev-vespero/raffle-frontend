import type { AuthRepository } from '../../domain/ports/auth-repository.port';

export class LogoutUseCase {
  constructor(private readonly repo: AuthRepository) {}

  async execute(): Promise<void> {
    return this.repo.logout();
  }
}
