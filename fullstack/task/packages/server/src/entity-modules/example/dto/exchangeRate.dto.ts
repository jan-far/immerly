import { Expose } from 'class-transformer';

export class ExchangeRateDTO {
    @Expose()
    id!: string;

    @Expose()
    country!: string;

    @Expose()
    currency!: string;

    @Expose()
    amount!: number;

    @Expose()
    currencyCode!: string;

    @Expose()
    rate!: string;
}
