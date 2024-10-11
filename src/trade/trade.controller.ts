import { Controller, Get, Render } from '@nestjs/common';
import { TradeService } from './trade.service';

@Controller()
export class TradeController {
  constructor(private readonly tradeService: TradeService) { }

  @Get('trades')
  @Render('trades/trade') // Render trades.ejs view
  async findAllAcceptedTrades() {
    const trades = await this.tradeService.findAcceptedTrades();
    return { trades }; // Passing trades to the view
  }
}
