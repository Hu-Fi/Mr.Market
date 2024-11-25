import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomLogger } from './modules/logger/logger.service';

@Controller()
export class AppController {
  private readonly logger = new CustomLogger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/docs', 302) // Redirect to the '/docs' route with a 302 status code (temporary redirect)
  redirectToDocs() {
    this.logger.debug('redirectToDocs');
  }
  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
