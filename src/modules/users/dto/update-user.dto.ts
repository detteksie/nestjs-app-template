import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { SexTypeEnum } from '|/elements/enums/sextype.enum';

export class UpdateUserDto {
  @ApiProperty({ default: 'Detteksie Smantie' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ enum: SexTypeEnum })
  @IsEnum(SexTypeEnum)
  @IsOptional()
  sexType: SexTypeEnum;

  @ApiProperty({ default: '2002-02-02' })
  @IsString()
  @IsOptional()
  birthdate: string;

  @ApiProperty({ default: '081234567890' })
  @IsString()
  @IsOptional()
  telephone: string;
}
