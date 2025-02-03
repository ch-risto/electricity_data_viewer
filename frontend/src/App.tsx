
import { useState } from 'react'
import chLogo from '/ch_white.png'
import './App.css'
import { Body, Input, Logo, Title, ResponseContainer, Response, Footer, StyledList, ListItem } from './components/styledComponents'
import { useFetchElectricityData } from './hooks/useFetchElectricityData.tsx'

function App() {
  const [date, setDate] = useState<string>('2023-05-05')

  const { data, summaryData, loading, error, errorMessage } = useFetchElectricityData(date);

  return (
    <Body>
      <div>
        <a href="https://christaeloranta.fi" target="_blank">
          <Logo src={chLogo} alt="ch logo" />
        </a>
      </div>
      <Title>Check Electricity data</Title>
      <div>Select Date:</div>
      <Input
        type='date'
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
        }}
      />

      {loading && <Response>Loading data..</Response>}
      {error && <Response>{errorMessage}</Response>}

      {data && summaryData ? (
        // TODO: tsekkaile tyylittelyt
        <ResponseContainer>
          <h2>Data for {data.date}</h2>
          <div>
            <strong>Summary:</strong> <br />
            Total consumption: {summaryData.total_consumption} kWh <br />
            Total production: {summaryData.total_production} kWh <br />
            Average hourly price: {summaryData.avg_price} €
          </div>
          <StyledList>
            {data.data.map((item, index) => (
              <ListItem key={index}>
                <strong>{item.starttime}</strong> <br />
                <strong>Production Amount:</strong> {item.productionamount} <br />
                <strong>Consumption Amount:</strong> {item.consumptionamount} <br />
                <strong>Hourly Price:</strong> {item.hourlyprice} <br /><br />
              </ListItem>
            ))}
          </StyledList>
        </ResponseContainer>
      ) : null}
      <Footer>
        This app is made as a pre-assignment for Solita Dev Academy Finland January 2025.<br />
        Christa Eloranta
      </Footer>
    </Body>
  )
}

export default App
