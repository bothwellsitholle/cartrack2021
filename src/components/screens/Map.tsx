import React from 'react';
import classes from './Map.module.css';
import GoogleMapReact from 'google-map-react';
import Marker from '../Marker';
import LoadingSpinner from '../UI/LoadingSpinner';

type AllFlights = (string | number)[][];

interface MapType {
  flightsData: AllFlights;
  onToggleDetails: () => void;
  isLoading: boolean;
}


/**
 * Map Component: ->
 * This component displays the google map on the screen. 
 * @param props -  Props: -> object with Aeroplane data, function to toggle FlightDetails 
 * component, isLoading state. 
 * @returns Map with an earoplane marker
 */
const Map: React.FC<MapType> = ({
  flightsData,
  onToggleDetails,
  isLoading,
}) => {
  return (
    <div className={classes.map__wrapper}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: 'AIzaSyBNLrJhOMz6idD05pzfn5lhA-TAw-mAZCU',
          language: 'en',
        }}
        defaultCenter={{
          lat: 38.830238,
          lng: -9.16709,
        }}
        defaultZoom={10}
      >
        {flightsData.map((data) => {
          return (
            <Marker
              showDetails={onToggleDetails}
              flightData={data}
              key={data[0]}
              lat={+data[4]}
              lng={+data[3]}
            />
          );
        })}
        {!isLoading && flightsData.length === 0 && (
          <h2 className={classes.service__alert}>
            Service is unavailable, system will try to reload in 12s
          </h2>
        )}
        {isLoading && flightsData.length === 0 && <LoadingSpinner />}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
