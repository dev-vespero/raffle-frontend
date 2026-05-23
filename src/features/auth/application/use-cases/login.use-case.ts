import type { AuthRepository } from '../../domain/ports/auth-repository.port';
import type { LoginDto } from '../dto/login.dto';
import type { AuthResult } from '../../domain/ports/auth-repository.port';

export class LoginUseCase {
  constructor(private readonly repo: AuthRepository) {}

  async execute(dto: LoginDto): Promise<AuthResult> {
    return this.repo.login(dto);
  }
}
