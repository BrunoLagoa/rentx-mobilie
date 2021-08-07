import React from 'react';
import LottieView from 'lottie-react-native';

import LoadingCar from '../../assets/load_car.json';

import { Container } from './styles';

export function LoadAnimation() {
  return (
    <Container>
      <LottieView
        source={LoadingCar}
        autoPlay
        loop
        style={{ width: 200 }}
        resizeMode='contain'
      />
    </Container>
  );
}
