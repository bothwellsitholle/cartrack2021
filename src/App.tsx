import React, { useEffect, useState} from 'react';
import {Switch, Route } from 'react-router-dom';
import Map from './components/screens/Map';
import FlightDetails from './components/screens/FlightDetails';

/**
 * fetchPlanLocations: -> 
 * This function fetches Aerolaplanes data from the allFlight API.
 * After fetching & parsing the data, the state for flightsData is then set.
 * 
 * 
 * refreshData Function: ->
 * This function calls the function which fetches flight's data above periodically
 * This functions uses setInterval function to work as a data refreshing machanism
 * for the App.
 * 
 * 
 * toggleDetails Function: ->
 * This function toggles the display for the Modal which renders
 * aeroplane's data upon a click event on the aeroplane's images 
 * or 'closewindow' button or modal's backdrop.
 */

type AllFlights = (string | number)[][]

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [flightsData, setflightsData] = useState<AllFlights>([]);

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

  //This will open or close Display of flight details
  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
    console.log('clicked Aeroplane Marker');
  };

  return (
    <div>
      <Switch>
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
      </Switch>
    </div>
  );
};


export default App;
