import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../UI/Modal';
import ModalContent from '../ModalContent';
import useReactRouter from 'use-react-router';

type ParamTypes = {
  id: string;
  name: string;
  country: string;
  lng: string;
  lat: string;
  altitude: string;
  speed: string;
};

interface imageType {
  imageId: string;
  imageUsername: string;
  imageUrl: string;
}

type AirplaneImages = string[][];

interface JetPhotos {
  _id: string;
  username: string;
  airplane_icao: string;
  airplane_image: string;
}

interface ImageType {
  imageUrl: string;
  imageUsername: string;
  imageId: string;
}
/**
   * fetchImageFromApi function
   * This function fetches images from /airplaneImages API
   * If the image is found it also post that image to /jetPhotos API
   * If image is posted successfully it sends get requests to /jetPhotos
   * and returns the data
   * @returns - an object of ImageType
   * 
   * 
   * fetchFlightDataFromOrigin function
   * This function fetches data from /jetPhotos, it checks if any images are found
   * If no images are found it calls the fetchImageFromApi function (above) which
   * sends a get request to a 3rd party API /jetPhotos
   * 
   * 
   * deleteImageHandler function:
   * This function deletes the image rendered on screen from the database via the /jetPhotos
   * 
   * 
   * updateImageHandler function:
   * This function updates the image rendered on screen with the images fetched from /jetPhotos
   * 
   * 
   * incrementer function:
   * Its used to increase the index of the flightImages
   * 
   * 
   * updateImageHandler function:
   * This function updates the image rendered on screen with the images fetched from /jetPhotos
 */
const FlightDetails: React.FC<{ showDetails: () => void }> = ({
  showDetails,
}) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [respMessage, setRespMessage] = useState('');
  const [imageWasFound, setImageWasFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flightImages, setFlightImages] = useState<string[][]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [image, setImage] = useState<imageType>({
    imageId: '',
    imageUsername: '',
    imageUrl: '',
  });

  const {
    match: {
      params: { id, name, country, lng, lat, altitude, speed },
    },
  } = useReactRouter<ParamTypes>();

  const defaultImage =
    'https://propertywiselaunceston.com.au/wp-content/themes/property-wise/images/no-image@2x.png';

  let altContent = <p>{altitude}</p>;

  if (altitude === 'null') {
    altContent = <p>No data</p>;
  }

  ////////////// Fetching image fom /airplaneImages //////////////////////////////
  const fetchImageFromApi = useCallback(async () => {
    console.log('Searching images from 3rd party');
    const resData = await fetch(
      `https://gentle-temple-27938.herokuapp.com/airplaneImages/${id}`
    );

    if (!resData.ok) {
      throw new Error('Something went wrong with fetching from API');
    }

    const res: AirplaneImages = await resData.json();
    console.log(res);

    if (res.length === 0) {
      console.log('Database Empty');
      setImageWasFound(false);
      let ImgData: ImageType = {
        imageUrl: defaultImage,
        imageId: 'xyz',
        imageUsername: 'bothwell',
      };
      return ImgData;
    }
    console.log('Fetch successful!');
    // const randomImageIndex = Math.floor(Math.random() * res.length);
    // setFlightImages(res);
    setFlightImages(res.filter((data) => data !== res[0]));
    console.log(res[0][0]);

    /**
     * When images are found this function sends a post request to /jetPhotos
     */
    try {
      const rez = await fetch(
        'https://gentle-temple-27938.herokuapp.com/jetPhotos',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'bothwellsitholle@gmail.com',
            airplane_icao: id,
            airplane_image: res[0][0],
          }),
        }
      );

      if (!rez.ok) {
        throw new Error('Failed to Post Image');
      }
      console.log('Successfully Posted image to /jetPhotos');
      console.log(rez);

      /**
       * When images are posted successfully this function sends a
       * get request to /jetPhotos and returns the data
       */
      console.log('fetching from /jetPhotos..');
      const resp = await fetch(
        'https://gentle-temple-27938.herokuapp.com/jetPhotos'
      );

      if (!resp.ok) {
        throw new Error('Something went wrong with fetching image');
      }

      const resdata: JetPhotos[] = await resp.json();
      let flightData = resdata.filter((data) => data.airplane_icao === id);
      console.log(flightData[0].airplane_image);
      setImageWasFound(true);
      let imgData2: ImageType = {
        imageUrl: flightData[0].airplane_image,
        imageId: flightData[0]._id,
        imageUsername: flightData[0].username,
      };
      return imgData2;
    } catch (err) {
      console.log(err.message);
      setImageWasFound(false);
      let ImgDataErr: ImageType = {
        imageUrl: defaultImage,
        imageId: 'xyz',
        imageUsername: 'bothwell',
      };
      return ImgDataErr;
    }
  }, [id]);

  //////////////////// Fetching Image from /jetPhotos ///////////////////////////////////////
  const fetchFlightDataFromOrigin = useCallback(async () => {
    const response = await fetch(
      'https://gentle-temple-27938.herokuapp.com/jetPhotos'
    );
    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    const res: JetPhotos[] = await response.json();
    let flightData = res.filter((data) => data.airplane_icao === id);

    if (flightData.length === 0) {
      try {
        console.log('No image found');
        let flightimage = await fetchImageFromApi();
        return flightimage;
      } catch (err) {
        console.log(err.message);
      }
    } else {
      console.log('Image found');
      
      // Fetch images for updating purposes
      await fetchImageFromApi();
      
      setImageWasFound(true);

      const imageData: ImageType = {
        imageUrl: flightData[0].airplane_image,
        imageId: flightData[0]._id,
        imageUsername: flightData[0].username,
      };
      return imageData;
    }
  }, [id, fetchImageFromApi]);

  /////////////////////////////////// Initial fetching of data /////////////////////////////////
  useEffect(() => {
    setIsLoading(true);
    setRespMessage('Searching for Image');
    fetchFlightDataFromOrigin()
      .then((image) => {
        setImage((prev) => {
          return {
            imageUrl: image.imageUrl,
            imageUsername: image.imageUsername,
            imageId: image.imageId,
          };
        });
        setIsLoading(false);
        setRespMessage('');
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err.message);
      });
  }, [fetchFlightDataFromOrigin]);

  //Delete Function for Images
  const deleteImageHandler = async () => {
    setIsError(false);
    setIsLoading(true);
    setFeedbackMessage('');
    setRespMessage('Deleting Image');
    const response = await fetch(
      `https://gentle-temple-27938.herokuapp.com/jetPhotos/${image.imageId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      setIsError(true);
      setIsLoading(false);
      return setRespMessage('Image Could not be deleted');
    }
    const resData = await response.json();
    setRespMessage(resData.message);
    setImage((prev) => {
      return {
        ...prev,
        imageUrl: defaultImage,
      };
    });
    setFeedbackMessage('Image successfully deleted');
    setIsLoading(false);
  };

/**
 * incrementer function
 * Its used to increase the index of the flightImages
 */
  const incrementer = () => {
    setImageIndex((prev) => (prev + 1) % flightImages.length);
  };

  // Update Function for Images
  const updateImageHandler = async () => {
    setIsError(false);
    if (flightImages.length === 0) {
      setIsError(true);
      return setFeedbackMessage(
        'No images found at the moment'
      );
    }
    setIsLoading(true);
    setRespMessage('Updating Image');
    setFeedbackMessage('');
    console.log(flightImages[1]);
    let url =
      'https://gentle-temple-27938.herokuapp.com/jetPhotos/60241b360f42f8c96bfc077b';
    // const randomImageIndex = Math.floor(Math.random() * flightImages.length);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: image.imageUsername,
        airplane_ica: id,
        airplane_image: flightImages[imageIndex][0],
      }),
    });

    if (!response.ok) {
      setIsError(true);
      setIsLoading(false);
      return setFeedbackMessage('Failed to update image, please try again!');
    }

    setImage((prev) => {
      return {
        ...prev,
        imageUrl: flightImages[imageIndex][0],
      };
    });

    incrementer();
    console.log(response);
    setFeedbackMessage('Image successfully updated!!');
    setIsLoading(false);
  };

  //Reseting Feedback Message
  /**
   * resetMessage function:
   * This function resets the feedback message to an empty string,
   * its connectec to the click event of the toast
   */
  const resetMessage = () => {
    setFeedbackMessage('');
  };

  return (
    <Modal onClose={showDetails}>
      <ModalContent
        name={name}
        country={country}
        isLoading={isLoading}
        imageUrl={image.imageUrl}
        respMessage={respMessage}
        isError={isError}
        feedbackMessage={feedbackMessage}
        lat={lat}
        lng={lng}
        altContent={altContent}
        speed={speed}
        showDetails={showDetails}
        onDeleteImage={deleteImageHandler}
        onUpdateImage={updateImageHandler}
        imageWasFound={imageWasFound}
        resetFeedback={resetMessage}
      />
    </Modal>
  );
};

export default FlightDetails;
