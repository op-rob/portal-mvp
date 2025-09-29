import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${configService.get('AUTH0_DOMAIN')}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get('AUTH0_AUDIENCE'),
      issuer: `https://${configService.get('AUTH0_DOMAIN')}/`,
      algorithms: ['RS256'],
    });
  }

  validate(payload: any) {
    console.log('🔍 Auth0 JWT Payload:', JSON.stringify(payload, null, 2));
    
    return {
      userId: payload.sub,
      email: payload.email || payload.preferred_username || payload['https://ownerpulse.com/email'] || null,
      name: payload.name || payload.nickname || 'Unknown User',
      picture: payload.picture,
      roles: payload['https://ownerpulse.com/roles'] || ['user'],
      permissions: payload['https://ownerpulse.com/permissions'] || [],
    };
  }
}