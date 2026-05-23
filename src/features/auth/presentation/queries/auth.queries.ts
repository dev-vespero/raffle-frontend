import { useMutation } from '@tanstack/vue-query';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { createAuthRepository } from '../../infrastructure/auth-repository.factory';
import type { LoginDto } from '../../application/dto/login.dto';
import type { RegisterDto } from '../../application/dto/register.dto';

const repo = createAuthRepository();

export function useLoginMutation() {
  return useMutation({
    mutationFn: (dto: LoginDto) => new LoginUseCase(repo).execute(dto),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (dto: RegisterDto) => new RegisterUseCase(repo).execute(dto),
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: () => new LogoutUseCase(repo).execute(),
  });
}
