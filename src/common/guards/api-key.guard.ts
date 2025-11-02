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
    const raw =
      (typeof request.header === 'function'
        ? request.header('x-api-key')
        : undefined) ??
      request.headers['x-api-key'] ??
      request.headers['X-API-KEY'];
    const apiKey = Array.isArray(raw) ? raw[0] : raw;

    // DEBUG: afficher la clé reçue et la clé attendue
    try {
      const expected =
        this.configService.get<string>('API_KEY') || process.env.API_KEY;
      console.log(
        '[DEBUG][ApiKeyGuard] received x-api-key=',
        apiKey,
        expected,
        ' expected_set=',
        !!expected,
      );
      console.log('[DEBUG][Headers]', request.headers);
    } catch (e) {
      // ignore
    }

    if (!apiKey) {
      throw new UnauthorizedException('Missing API Key');
    }

    const validKey =
      this.configService.get<string>('API_KEY') || process.env.API_KEY;

    if (apiKey !== validKey) {
      throw new ForbiddenException('Invalid API Key');
    }

    return true;
  }
}
