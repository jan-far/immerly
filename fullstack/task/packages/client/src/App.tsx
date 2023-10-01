import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { GET_EXCHANGE_RATES } from './queries';
import './App.css';

interface IExchangeRates {
    id: string;
    currencyCode: string;
    country: string;
    amount: number;
    rate: string;
    currency: string;
    createdAtUtc: Date;
}

export const App = () => {
    const { loading, error, data } = useQuery(GET_EXCHANGE_RATES);
    const [filtered, setFiltered] = useState<IExchangeRates[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [timeDifference, setTimeDifference] = useState('0');

    const updateTimeDifference = () => {
        const currentTime = new Date().getTime();
        const lastUpdatedTime = new Date(exchangeRates[0].createdAtUtc).getTime();

        const difference = currentTime - lastUpdatedTime;

        // Calculate time units (days, hours, minutes, seconds)
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Create a formatted string
        const formattedTimeDifference = `${days > 0 ? `${days}d ` : ''}${
            hours > 0 ? `${hours}h ` : ''
        }${minutes}m ${seconds}s`;

        // Update the state with the formatted time difference
        setTimeDifference(formattedTimeDifference);
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (data) {
            updateTimeDifference();
            intervalId = setInterval(updateTimeDifference, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const exchangeRates: IExchangeRates[] = data.exchangeRates;

    const handleSearch = (text: string) => {
        setSearchKeyword(text);
        const search = exchangeRates.filter(
            (fx) =>
                fx.country.toLowerCase().includes(text.toLowerCase()) ||
                fx.currency.toLowerCase().includes(text.toLowerCase())
        );
        setFiltered(search);
    };

    const renderRecord = (fx: IExchangeRates, i: number) => {
        return (
            <TableRow
                key={fx.id}
                className={`${
                    i % 2 === 0 ? 'bg-blue-100 hover:bg-gray-100 ' : 'bg-blue-200 hover:bg-gray-50 '
                } border-b`}
            >
                <TableCell
                    scope="row"
                    className="px-6 py-3 font-bold text-gray-900 whitespace-nowrap dark:text-white"
                >
                    {fx.country}
                </TableCell>
                <TableCell className="px-6 py-3">{fx.currency}</TableCell>
                <TableCell className="px-6 py-3">{fx.amount}</TableCell>
                <TableCell className="px-6 py-3">{fx.currencyCode}</TableCell>
                <TableCell className="px-6 py-3">{fx.rate}</TableCell>
            </TableRow>
        );
    };

    return (
        <div className="md:container md:mx-auto mx-2 py-5 relative overflow-x-auto shadow-md sm:rounded-lg">
            <blockquote className="  px-2 pb-4 text-lg font-semibold text-left text-gray-900 w-full">
                Exchange Rate Today - {new Date().toDateString()}
                <p className="font-semibold text-xs text-gray-500 mb-2">
                    Last Updated: {timeDifference} ago
                </p>
                <p className="mt-1 text-sm font-normal text-gray-500 sm:items-center">
                    Checkouk the list of the Czech Republic current exchange rates for foreign
                    currency
                </p>
                <sub className="text-xs text-gray-300 font-mono">
                    Source:CNB(Czech National Bank)
                </sub>
            </blockquote>
            <div className="pb-2 bg-white ">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="table-search" className="sr-only">
                    Search
                </label>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="table-search"
                        className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg sm:w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 xs:w-[80%]"
                        placeholder="Search by currency and country"
                        value={searchKeyword}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>
            <Table className="w-full caption-top text-sm font-medium text-left text-gray-700">
                <TableHeader className="font-extrabold text-gray-100 uppercase bg-blue-500 ">
                    <TableRow className="border-collapse border border-slate-700">
                        <TableHead scope="col" className="px-6 py-3">
                            Country
                        </TableHead>
                        <TableHead scope="col" className="px-6 py-3">
                            Currency
                        </TableHead>
                        <TableHead scope="col" className="px-6 py-3">
                            Amount
                        </TableHead>
                        <TableHead scope="col" className="px-6 py-3">
                            Code
                        </TableHead>
                        <TableHead scope="col" className="px-6 py-3">
                            Rate
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className=" bg-green-500 border border-collapse border-slate-400">
                    {filtered.length > 0
                        ? filtered.map((fx, i) => renderRecord(fx, i))
                        : exchangeRates.map((fx, i) => renderRecord(fx, i))}
                </TableBody>
            </Table>
        </div>
    );
};

export default App;
