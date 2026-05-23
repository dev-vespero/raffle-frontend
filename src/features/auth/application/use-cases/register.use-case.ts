import type { AuthRepository, RegistrationData, AuthResult } from '../../domain/ports/auth-repository.port';
import type { RegisterDto } from '../dto/register.dto';

export class RegisterUseCase {
  constructor(private readonly repo: AuthRepository) {}

  async execute(dto: RegisterDto): Promise<AuthResult> {
    const registrationData: RegistrationData = {
      email: dto.email,
      password: dto.password,
      name: dto.name,
      phone: dto.phone,
      identification: dto.identification,
    };

    return this.repo.register(registrationData);
  }
}
