
import { useState } from 'react'
import chLogo from '/ch_white.png'
import { Body, Input, Logo, Title, ResponseContainer, Response, Footer, StyledList, ListItem, Table } from './components/styledComponents'
import { useFetchElectricityData } from './hooks/useFetchElectricityData.tsx'
import { useFetchMinMaxDate } from './hooks/useFetchMinMaxDate.tsx';
import { formatDateFromDate, formatTimeFromDatetime } from './utils/dateUtils.tsx';
import { kWhToMWh } from './utils/electricityUtils.tsx';

function App() {
  const [date, setDate] = useState<string | null>(null);

  const { data, summaryData, negativePricePeriod, loading, error, errorMessage } = useFetchElectricityData(date);
  const { dateRange } = useFetchMinMaxDate();

  return (
    <Body>
      <div>
        <a href="https://christaeloranta.fi" target="_blank">
          <Logo src={chLogo} alt="ch logo" />
        </a>
      </div>
      <Title>Check Electricity data</Title>
      <div>
        There is electricitydata available from {dateRange.minDate} to {dateRange.maxDate}.
      </div>
      <Input
        type='date'
        value={date ?? ''}
        onChange={(e) => {
          setDate(e.target.value);
        }}
      />

      {!date && <Response>Select a date to load data</Response>}
      {loading && <Response>Loading data..</Response>}
      {error && errorMessage && <Response>{errorMessage}</Response>}

      {data && summaryData ? (
        // TODO: tsekkaile tyylittelyt
        <ResponseContainer>
          <h2>Data for {formatDateFromDate(data.date)}</h2>
          <Table>
            <tr><th>Summary for the day</th></tr>
            <tr>
              <th>Total consumption:</th><td>{kWhToMWh(summaryData.total_consumption)}</td>
            </tr>
            <tr>
              <th>Total production:</th><td>{kWhToMWh(summaryData.total_production)}</td>
            </tr>
            <tr>
              <th>Average hourly price:</th><td>{Number(summaryData.avg_price).toFixed(2)} €</td>
            </tr>
            {negativePricePeriod ? (
              negativePricePeriod.duration_hours && negativePricePeriod.duration_hours > 0 ? (
                <>
                  <tr>
                    <td>
                      Longest period of negative price for the day was {negativePricePeriod.duration_hours} hours
                    </td>
                  </tr>
                  <tr>
                    <td>
                      starting at {formatTimeFromDatetime(negativePricePeriod.start_time)} and average of {negativePricePeriod.avg_price ? Number(negativePricePeriod.avg_price).toFixed(2) : 0}€
                    </td>
                  </tr>
                  <tr>
                    <td>

                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td>There were no negative electricity prices on this day</td>
                </tr>
              )
            ) : null}
          </Table>
          <Table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Production</th>
                <th>Consumption</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((item, index) => (
                <tr key={index}>
                  <td>{formatTimeFromDatetime(item.starttime)}</td>
                  <td>{kWhToMWh(item.productionamount)}</td>
                  <td>{kWhToMWh(item.consumptionamount)}</td>
                  <td>{Number(item.hourlyprice).toFixed(2)}€</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ResponseContainer >
      ) : null
      }
      <Footer>
        This app is made as a pre-assignment for Solita Dev Academy Finland January 2025.<br />
        Christa Eloranta
      </Footer>
    </Body >
  );
}

export default App
