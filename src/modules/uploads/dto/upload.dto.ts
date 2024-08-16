import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;
}

export class UploadImagesDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: Express.Multer.File[];
}

export class UploadMultipleFilesDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  avatar?: Express.Multer.File[];

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  backgrounds?: Express.Multer.File[];
}

export class UploadResponse {
  @ApiProperty()
  fieldname: string;

  @ApiProperty()
  originalname: string;

  @ApiProperty()
  encoding: string;

  @ApiProperty()
  mimetype: string;

  @ApiProperty()
  size: number;
}

export class UploadDiskResponse {
  @ApiProperty()
  fieldname: string;

  @ApiProperty()
  originalname: string;

  @ApiProperty()
  encoding: string;

  @ApiProperty()
  mimetype: string;

  @ApiProperty()
  destination: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  size: number;
}

export class UploadMultipleFilesResponse {
  @ApiProperty({ type: () => [UploadResponse] })
  avatar: UploadResponse[];

  @ApiProperty({ type: () => [UploadResponse] })
  background: UploadResponse[];
}

export class UploadMultipleFilesDiskResponse {
  @ApiProperty({ type: () => [UploadDiskResponse] })
  avatar: UploadDiskResponse[];

  @ApiProperty({ type: () => [UploadDiskResponse] })
  background: UploadDiskResponse[];
}
