import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Récupérer la clé depuis les headers
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('Missing API Key');
    }

    // Comparer avec la clé valide (depuis .env)
    const validKey =
      this.configService.get<string>('API_KEY') || process.env.API_KEY;

    if (apiKey !== validKey) {
      throw new ForbiddenException('Invalid API Key');
    }

    return true;
  }
}
