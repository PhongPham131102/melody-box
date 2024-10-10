import { Controller } from '@nestjs/common';
import { ActionHistoryService } from './action-history.service';

@Controller('logs')
export class ActionHistoryController {
  constructor(private readonly actionHistoryService: ActionHistoryService) {}
}
