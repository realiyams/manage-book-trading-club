import { Controller, Get, Request, Res } from '@nestjs/common';
import { TradeService } from './trade.service';

@Controller()
export class TradeController {
  constructor(private readonly tradeService: TradeService) { }

  @Get('trades')
  async findAllAcceptedTrades(@Request() req, @Res() res) {
    const user = req.session.user;
    const trades = await this.tradeService.findAcceptedTrades();

    if (!user) {
      return res.render('trades/trade', {
        trades: trades,
      });
    }

    return res.render('trades/trade', {
      isAuthenticated: true,
      user,
      trades: trades,
    });
  }
}
