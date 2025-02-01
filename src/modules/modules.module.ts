import { Module } from '@nestjs/common';

import { TasksModule } from './tasks/tasks.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, TasksModule, UploadsModule],
})
export class ModulesModule {}
