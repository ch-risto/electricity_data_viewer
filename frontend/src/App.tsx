
import { useState } from 'react'
import chLogo from '/ch_white.png'
import { Body, Input, Logo, Title, ResponseContainer, Response, Footer, StyledList, ListItem, Table } from './components/styledComponents'
import { useFetchElectricityData } from './hooks/useFetchElectricityData.tsx'
import { useFetchMinMaxDate } from './hooks/useFetchMinMaxDate.tsx';
import { formatDateFromDate, formatTimeFromDatetime } from './utils/dateUtils.tsx';

function App() {
  const [date, setDate] = useState<string | null>(null);

  const { data, summaryData, loading, error, errorMessage } = useFetchElectricityData(date);
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
          <div>
            <strong>Summary:</strong> <br />
            <Table>
              <tr>
                <th>Total consumption</th><td>{Number(summaryData.total_consumption).toFixed(2) ?? "-"} kWh </td>
              </tr>
              <tr>
                <th>Total production:</th><td>{Number(summaryData.total_production).toFixed(2) ?? "-"} kWh </td>
              </tr>
              <tr>
                <th>Average hourly price:</th><td>{Number(summaryData.avg_price).toFixed(2)} €</td>
              </tr>
            </Table>
          </div>
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
                  <td>{Number(item.productionamount).toFixed(2) ?? "-"} kWh</td>
                  <td>{Number(item.consumptionamount).toFixed(2) ?? "-"} kWh</td>
                  <td>{Number(item.hourlyprice).toFixed(2)} €</td>
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
