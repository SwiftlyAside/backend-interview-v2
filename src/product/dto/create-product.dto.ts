import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  size: string;

  @IsNotEmpty()
  @IsString()
  color: string;
}