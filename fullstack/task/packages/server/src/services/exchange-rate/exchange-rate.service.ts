import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { MoreThan, Repository } from 'typeorm';
import { firstValueFrom, map } from 'rxjs';
import { ExchangeRate } from '../../entities';
import { ExchangeRateDTO } from '../../entity-modules/example/dto/exchangeRate.dto';

@Injectable()
export class ExchangeRateService {
    constructor(
        @InjectRepository(ExchangeRate)
        private exchangeRateRepository: Repository<ExchangeRate>,
        private readonly httpService: HttpService
    ) {}

    public getExchangeRates = async (): Promise<ExchangeRateDTO[]> => {
        // TODO: Implement the fetching and parsing of the exchange rates.
        // Use this method in the resolver.
        const cacheLifetimeMs = 5 * 60 * 1000; // 5 minutes

        const cachedRates = await this.exchangeRateRepository.find({
            where: {
                createdAtUtc: MoreThan(new Date(Date.now() - cacheLifetimeMs)),
            },
        });

        if (cachedRates.length > 0) {
            return cachedRates.sort((a, b) => (a.country > b.country ? 1 : -1));
        }

        const API_LINK = 'https://api.cnb.cz/cnbapi/exrates/daily?lang=EN';
        const response = await this.httpService.get(API_LINK);
        const data: { rates: ExchangeRateDTO[] } = await firstValueFrom(
            response.pipe(
                map((res) => {
                    return res.data;
                })
            )
        );

        const result = await Promise.all(
            data.rates.map(async (d: ExchangeRateDTO) => {
                const create = await this.exchangeRateRepository.create({
                    amount: d.amount,
                    currency: d.currency,
                    currencyCode: d.currencyCode,
                    country: d.country,
                    rate: d.rate,
                    createdAtUtc: new Date(),
                });

                return this.exchangeRateRepository.save(create);
            })
        );

        const res = result
            .map((rate) => {
                return plainToInstance(ExchangeRateDTO, rate, { excludeExtraneousValues: true });
            })
            .sort((a, b) => (a.country > b.country ? 1 : -1));
        return res;
    };
}
