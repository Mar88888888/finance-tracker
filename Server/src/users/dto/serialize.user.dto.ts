import { Exclude, Transform } from 'class-transformer';

export class UserSerializeDto {
  id: number;
  name: string;
  email: string;
  age: number;
  isEmailVerified: boolean;
  
  @Transform(value=> value ? 'male' : 'female')
  gender: boolean;
  
  @Exclude()
  password: string;
  
  @Exclude()
  verificationToken?: string;
}
