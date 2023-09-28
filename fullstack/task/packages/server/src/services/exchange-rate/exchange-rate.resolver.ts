import { Query, Resolver } from '@nestjs/graphql';
import { ExchangeRate } from 'src/entities';
import { ExchangeRateService } from './exchange-rate.service';

@Resolver()
export class ExchangeRateResolver {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    // TODO: Implement a GraphQL Query that returns the exchange rates
    @Query(() => [ExchangeRate])
    async exchangeRates() {
        return this.exchangeRateService.getExchangeRates();
    }
}
