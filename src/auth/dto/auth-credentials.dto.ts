import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class AuthCredentialsDTO {
  // TODO consider validating this input within Repo
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/\d/, {
    message: 'Password must have at least one number',
  })
  @Matches(/[a-z]/, {
    message: 'Password must have at least lowercase letter',
  })
  @Matches(/[A-Z]/, {
    message: 'Password have at least one uppercase letter',
  })
  @MinLength(6)
  password: string;
}
