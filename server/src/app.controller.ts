import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @Redirect('/docs', 302) // Redirect to the '/docs' route with a 302 status code (temporary redirect)
  redirectToDocs() {}
}
