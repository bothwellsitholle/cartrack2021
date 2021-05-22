import React from 'react';
import classes from './Marker.module.css';
import airplane from '../airplane1.png';
import {Link} from 'react-router-dom';
import styled, {keyframes} from 'styled-components';


const Plane = styled.img`
object-fit: contain;
height: 28px;
transform: rotateZ(${props => props.trackNumber}deg);
transition: all 3000ms ease-out;
  `

interface MarkerType {
  showDetails: () => void;
  flightData: (string | number) [];
  lat: number;
  lng: number; 
}

const Marker: React.FC <MarkerType> = ({
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
        <Plane
          src={airplane}
          alt='flight'
          trackNumber={trackNumber}
        />
        </div>
        <div className={classes.marker__details}>
          <p>
            {flightData[1]}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Marker;
