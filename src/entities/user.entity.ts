import { InternalServerErrorException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, instanceToPlain } from 'class-transformer';
import { isArray } from 'class-validator';
import { nanoid } from 'nanoid';
import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SexTypeEnum } from '|/elements/enums/sextype.enum';
import { hashPassword } from '|/utils/bcrypt.util';

import { DateAt } from './date';
import { Role } from './role.entity';

@Entity()
export class User {
  @Column(() => DateAt, { prefix: '' })
  date: DateAt;

  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty()
  @Column({ default: 'lorem-ipsum' })
  signature: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({
    nullable: true,
    default:
      'https://cdn.iconfinder.com/data/icons/music-ui-solid-24px/24/user_account_profile-2-256.png',
  })
  picture: string;

  @ApiProperty()
  @Column({
    name: 'sex_type',
    nullable: true,
    // enum: ['Unknown', 'Male', 'Female', 'Other'],
    enum: SexTypeEnum,
    type: 'enum',
  })
  sexType: string;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  birthdate: string;

  @ApiProperty()
  @Column({ nullable: true })
  telephone: string;

  /** relations */

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_to_role',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  declare joinRoles?: Role[];

  /** optional declarations */

  declare roles?: string[];

  /** hooks */

  @BeforeInsert()
  async handleBeforeInsert() {
    try {
      this.signature = nanoid(8);
      this.password = await hashPassword(this.password);
    } catch (err) {
      throw new InternalServerErrorException(err?.message);
    }
  }

  @AfterLoad()
  afterLoad() {
    if (this.roles && isArray<Role>(this.roles)) {
      const roles = this.roles as Array<Role>;
      this.roles = roles.map((role) => role.type);
    }
  }

  /** overrides */

  toJSON() {
    return instanceToPlain(this);
  }
}
