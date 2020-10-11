import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { LoggingInterceptor } from './interceptor/logging.interceptor';

@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO) {
    return this.authService.signUp(authCredentialsDTO);
  }

  @Post('/signin')
  @HttpCode(200)
  signIn(@Body() authCredentialsDTO: AuthCredentialsDTO) {
    return this.authService.signIn(authCredentialsDTO);
  }
}
