import React from 'react';
import classes from './Marker.module.css';
import airplane from '../airplane1.png';
import { Link } from 'react-router-dom';

interface MarkerType {
  showDetails: () => void;
  flightData: (string | number)[];
  lat: number;
  lng: number;
}

/**
 * Marker Component: ->
 * This component is the props.child for the Map's component, it is an Aeroplane image Marker
 * for the map. This component sets plane's data via the react-router-dom Link element
 *  which will be extracted by the FlightDetails component when clicked.
 * @param props -  Props: -> An object with an array of Aeroplane's data fetched from allFlight API, function to toggle Modal,
 * latitude and longitude values.
 * @returns a clickable aeroplane image as a googlemaps marker
 *  properly positioned and ready to be rendered on the google maps.
 */
const Marker: React.FC<MarkerType> = ({
  showDetails,
  flightData,
  lat,
  lng,
}) => {
  const id = flightData[0];
  const name = flightData[1].toString().trim();
  const country = flightData[2];
  const altitude = flightData[5];
  const speed = flightData[6];
  const trackNumber = flightData[7];

  return (
    <Link
      className={classes.marker__link}
      onClick={showDetails}
      to={`/flightDetails/${id}/${name}/${country}/${lng}/${lat}/${altitude}/${speed}`}
    >
      <div className={classes.marker__wrapper}>
        <div className={classes.singlePlane}>
          <img
            src={airplane}
            style={{ transform: `rotateZ(${trackNumber}deg)` }}
            alt='flight'
          />
        </div>
        <div className={classes.marker__details}>
          <p>{flightData[1]}</p>
        </div>
      </div>
    </Link>
  );
};

export default Marker;
