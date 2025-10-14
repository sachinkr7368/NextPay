import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCheckoutDto {
  @ApiProperty({ example: 'price_1234567890' })
  @IsString()
  priceId: string;
}

