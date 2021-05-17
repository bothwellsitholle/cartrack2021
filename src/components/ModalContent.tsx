import React from 'react';
import classes from './ModalContent.module.css';
import LoadingSpinner from './UI/LoadingSpinner';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';

interface Props {
  name: string;
  country: string;
  isLoading: boolean;
  imageUrl: string;
  respMessage: string;
  isError: boolean;
  feedbackMessage: string;
  lat: string;
  lng: string;
  altContent: JSX.Element;
  speed: string;
  showDetails: () => void;
  onDeleteImage: () => void;
  onUpdateImage: () => void;
  imageWasFound: boolean;
  resetFeedback: () => void;
}

const ModalContent: React.FC <Props> = ({
  name,
  country,
  isLoading,
  imageUrl,
  respMessage,
  isError,
  feedbackMessage,
  lat,
  lng,
  altContent,
  speed,
  showDetails,
  onDeleteImage,
  onUpdateImage,
  imageWasFound,
  resetFeedback,
}) => {
  return (
    <div
      className={classes.flightDetail__wrapper}
    >
      <div className={classes.flightDetail__content}>
        {isLoading && <LoadingSpinner />}
        {!isLoading && <img src={imageUrl} alt='' />}
        {isLoading && <p className={classes.flightDetail__message}>{respMessage}</p>}
      </div>
      {isError && !isLoading && feedbackMessage && (
        <Alert severity='error' onClose={resetFeedback}>
          {feedbackMessage}
        </Alert>
      )}
      {!isError && !isLoading && feedbackMessage && (
        <Alert onClose={resetFeedback}>{feedbackMessage}</Alert>
      )}
      <h2>FLIGHT DETAILS</h2>
      <div className={classes.flightDetail__container}>
        <div>
          <h4>Name</h4>
          <p>{name}</p>
        </div>
        <div>
          <h4>Country</h4>
          <p>{country.slice(0, 14)}</p>
        </div>
        <div>
          <h4>Location (lat, lng)</h4>
          <p>
            {' '}
            {lat}, {lng}
          </p>
        </div>
        <div>
          <h4>Altitude /m</h4>
          {altContent}
        </div>
        <div>
          <h4>Velocity m/s</h4>
          <p>{speed} </p>
        </div>
      </div>
      <div className={classes.flightDetail__buttons}>
        <Button onClick={showDetails} variant='contained' color='secondary'>
          Close Window
        </Button>
        {imageWasFound && (
          <Button onClick={onDeleteImage} variant='outlined'>
            Delete Image
          </Button>
        )}
        {imageWasFound && (
          <Button onClick={onUpdateImage} variant='outlined' color='default'>
            Update Image
          </Button>
        )}
      </div>
    </div>
  );
};

export default ModalContent;
