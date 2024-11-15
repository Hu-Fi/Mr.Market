import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  GetDepositAddressDto,
  GetSupportedNetworksDto,
  GetTokenSymbolDto,
  // JoinStrategyDto,
  StartStrategyDto,
  StopStrategyDto,
} from './admin-strategy.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth() // Secures endpoints with JWT
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('strategy/start')
  @ApiOperation({
    summary: 'Start a trading strategy',
    description:
      'Start a strategy such as arbitrage, market making, or volume trading for the user.',
  })
  @ApiBody({
    description: 'Request body containing strategy parameters',
    type: StartStrategyDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully started the strategy',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid strategy parameters',
  })
  async startStrategy(@Body() startStrategyDto: StartStrategyDto) {
    return this.adminService.startStrategy(startStrategyDto);
  }

  @Post('strategy/stop')
  @ApiOperation({
    summary: 'Stop a trading strategy',
    description:
      'Stop a running strategy for the user based on strategy type and other parameters.',
  })
  @ApiBody({
    description: 'Request body containing strategy stop parameters',
    type: StopStrategyDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully stopped the strategy',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid strategy parameters',
  })
  async stopStrategy(@Body() stopStrategyDto: StopStrategyDto) {
    return this.adminService.stopStrategy(stopStrategyDto);
  }

  @Post('exchange/deposit-address')
  @ApiOperation({
    summary: 'Get a deposit address for an exchange',
    description:
      'Retrieve the deposit address for a specific token on a given exchange and network.',
  })
  @ApiBody({
    description:
      'Request body containing exchange name, token symbol, network, and account label',
    type: GetDepositAddressDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the deposit address for the specified token, exchange, and network',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or unsupported token/network.',
  })
  async getDepositAddress(@Body() getDepositAddressDto: GetDepositAddressDto) {
    return this.adminService.getDepositAddress(getDepositAddressDto);
  }

  @Post('exchange/supported-deposit-networks')
  @ApiOperation({
    summary: 'Get Supported Networks for a Token on an Exchange',
    description:
      'Retrieve all the supported deposit networks for a specific token on a given exchange.',
  })
  @ApiBody({
    description:
      'Request body containing exchange name, token symbol, and account label',
    type: GetSupportedNetworksDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'A list of supported networks for the specified token on the given exchange',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or unsupported token/network.',
  })
  async getSupportedNetworks(
    @Body() getSupportedNetworksDto: GetSupportedNetworksDto,
  ) {
    const { exchangeName, tokenSymbol, accountLabel } = getSupportedNetworksDto;

    try {
      return await this.adminService.getSupportedNetworks(
        exchangeName,
        tokenSymbol,
        accountLabel,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('chain-info')
  @ApiOperation({
    summary: 'Get Chain Info by Chain ID',
    description:
      'Fetch detailed chain information (RPC URLs, native currency, etc.) for a given chain ID.',
  })
  @ApiQuery({
    name: 'chainId',
    description:
      'The ID of the blockchain (e.g., 1 for Ethereum, 56 for Binance Smart Chain)',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns detailed chain information based on the provided chain ID',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid chain ID.',
  })
  async getChainInfo(@Query('chainId') chainId: number) {
    try {
      return await this.adminService.getChainInfo(chainId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('token-symbol')
  @ApiOperation({
    summary: 'Get Token Symbol by Contract Address and Chain ID',
    description:
      'Retrieve the symbol of an ERC-20 token by providing its contract address and chain ID.',
  })
  @ApiBody({
    description: 'Request body containing the contract address and chain ID',
    type: GetTokenSymbolDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the token symbol for the given contract address and chain ID',
    schema: {
      type: 'string',
      example: 'USDT',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid contract address or chain ID.',
  })
  async getTokenSymbol(@Body() body: GetTokenSymbolDto) {
    const { contractAddress, chainId } = body;
    try {
      return await this.adminService.getTokenSymbolByContract(
        contractAddress,
        chainId,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('contribution/verify')
  @ApiOperation({
    summary: 'Verify a contribution by contribution ID',
    description:
      'Verify the contribution details such as amount, token, and transaction status',
  })
  @ApiQuery({
    name: 'contributionId',
    description: 'The ID of the contribution to verify',
    example: 'uuid-of-contribution',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully verified the contribution',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid contribution ID or verification failure',
  })
  async verifyContribution(
    @Query('contributionId') contributionId: string,
  ): Promise<boolean> {
    return await this.adminService.verifyContribution(contributionId);
  }

  @Get('/admin')
  getAdminData() {
    return 'This is admin data';
  }

  @Get('/config')
  getConfigData() {
    return 'This is config data';
  }

  //TODO: Implement returning strategies to be dispalyed.
  @Get('strategies')
  async getRunningStrategies() {
    return this.adminService.getRunningStrategies();
  }

  // @Get('strategy/performance/:strategyKey')
  // async getStrategyPerformance(@Param('strategyKey') strategyKey: string) {
  //   return this.adminService.getStrategyPerformance(strategyKey);
  // }
}
