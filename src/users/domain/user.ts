import { Exclude } from 'class-transformer';

export class User {
  id: number;
  email: string;

  @Exclude({ toPlainOnly: true })
  password: string;
  name: string;
}
