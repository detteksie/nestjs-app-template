import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { DateAt } from './date';
import { User } from './user.entity';

@Entity()
export class Role {
  @ApiProperty()
  @Column(() => DateAt, { prefix: false })
  date: DateAt;

  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @ApiProperty()
  @Column({ transformer: { from: (value) => value, to: (value: string) => value.toLowerCase() } })
  type: string;

  /** relations */

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_to_role',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  joinUsers: User[];
}
