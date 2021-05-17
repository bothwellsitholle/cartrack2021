import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import Map from './components/screens/Map';
import FlightDetails from './components/screens/FlightDetails';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [flightsData, setflightsData] = useState([]);

  useEffect(() => {
    const fetchPlanLocations = async () => {
      setIsLoading(true);
      const response = await fetch(
        'https://gentle-temple-27938.herokuapp.com/allFlights'
      );

      // check Response
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      if (response.status === 503) {
        throw new Error('Servive is not available at the moment');
      }
      const data = await response.json();
      console.log(data);
      setflightsData(data);
      setIsLoading(false);
    };

    const refreshData = setInterval(() => {
      fetchPlanLocations().catch((err) => {
        setIsLoading(false);
        console.log(err.message);
      });
    }, 12000);

    return () => {
      clearInterval(refreshData);
    };
  }, []);

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
    console.log('toggled data')
  };

  return (
    <div>
      <Route path='/flightDetails/:id/:name/:country/:lng/:lat/:altitude/:speed'>
        {showDetails && (
          <FlightDetails
             showDetails={() => {
             setShowDetails((prev) => !prev);
             }}
          />
        )}
        <Map
          flightsData={flightsData}
          isLoading={isLoading}
          onToggleDetails={toggleDetails}
        />
      </Route>

      <Route path='/' exact>
        <Map
          flightsData={flightsData}
          isLoading={isLoading}
          onToggleDetails={toggleDetails}
        />
      </Route>
    </div>
  );
};

// ALTERNATIVE KEY: 'AIzaSyBNLrJhOMz6idD05pzfn5lhA-TAw-mAZCU',

export default App;

