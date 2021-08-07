import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { format } from 'date-fns';

import { getPlatformDate } from '../../utils/getPlatformDate';
import { BackButton } from '../../components/BackButton';
import {
  Calendar,
  DayProps,
  generateInterval,
  MarkedDateProps,
} from '../../components/Calendar';
import { Button } from '../../components/Button';

import { CarDTO } from '../../dtos/CarDTO';

import ArrowSvg from '../../assets/arrow.svg';

import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DateTitle,
  DateValue,
  Content,
  Footer,
} from './styles';

interface RentalPeriod {
  startFormated: string;
  endFormated: string;
}

interface Params {
  car: CarDTO;
}

export function Scheduling() {
  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>(
    {} as DayProps
  );
  const [markedDates, setMarkedDates] = useState<MarkedDateProps>(
    {} as MarkedDateProps
  );
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>(
    {} as RentalPeriod
  );

  const route = useRoute();
  const { car } = route.params as Params;
  const theme = useTheme();
  const navigation = useNavigation();

  function handleConfirmRetal() {
    navigation.navigate('SchedulingDetails', {
      car,
      dates: Object.keys(markedDates),
    });
  }

  function handleBack() {
    navigation.goBack();
  }

  function handleChangeDate(date: DayProps) {
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if (start.timestamp > end.timestamp) {
      start = end;
      end = start;
    }

    setLastSelectedDate(end);
    const interval = generateInterval(start, end);
    setMarkedDates(interval);

    const firstDate = Object.keys(interval)[0];
    const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

    setRentalPeriod({
      startFormated: format(getPlatformDate(new Date(firstDate)), 'dd/MM/yyyy'),
      endFormated: format(getPlatformDate(new Date(endDate)), 'dd/MM/yyyy'),
    });
  }

  return (
    <Container>
      <StatusBar
        barStyle='light-content'
        translucent
        backgroundColor='transparent'
      />
      <Header>
        <BackButton color={theme.colors.shape} onPress={handleBack} />

        <Title>
          Escolha uma {'\n'}
          data de início e {'\n'}
          fim do aluguel
        </Title>

        <RentalPeriod>
          <DateInfo selected={!!rentalPeriod.startFormated}>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.startFormated}</DateValue>
          </DateInfo>

          <ArrowSvg />

          <DateInfo selected={!!rentalPeriod.endFormated}>
            <DateTitle>ATÉ</DateTitle>
            <DateValue>{rentalPeriod.endFormated}</DateValue>
          </DateInfo>
        </RentalPeriod>
      </Header>

      <Content>
        <Calendar markedDates={markedDates} onDayPress={handleChangeDate} />
      </Content>

      <Footer>
        <Button
          title='Confirmar'
          onPress={handleConfirmRetal}
          enabled={!!rentalPeriod.startFormated}
        />
      </Footer>
    </Container>
  );
}
