import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller.js';
import { AdminGuard } from './admin.guard.js';
import { GameMonetizeImportService } from './gamemonetize-import.service.js';

@Module({
  controllers: [AdminController],
  providers: [AdminGuard, GameMonetizeImportService],
})
export class AdminModule {}
