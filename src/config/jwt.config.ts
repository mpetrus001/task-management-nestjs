import { registerAs } from '@nestjs/config';

export default registerAs('jwtConfig', () => ({
  secret: process.env.JWT_SECRET || 'secret',
  signOptions: {
    expiresIn: 3600,
  },
}));
