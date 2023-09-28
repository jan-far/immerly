import { gql } from '@apollo/client';

export const GET_EXCHANGE_RATES = gql`
    query {
        exchangeRates {
            id
            currencyCode
            country
            amount
            rate
            currency
        }
    }
`;
