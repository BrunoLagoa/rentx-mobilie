import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'styled-components';

import { Bullet } from '../../../components/Bullet';
import { BackButton } from '../../../components/BackButton';
import { PasswordInput } from '../../../components/PasswordInput';
import { Button } from '../../../components/Button';

import { api } from '../../../services/api';

import {
  Container,
  Header,
  Steps,
  Title,
  SubTitle,
  Form,
  FormTitle,
} from './styles';

interface Params {
  user: {
    name: string;
    email: string;
    driverLicense: string;
  };
}

export function SignUpSecondStep() {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const navigation = useNavigation();
  const route = useRoute();

  const theme = useTheme();

  const { user } = route.params as Params;

  function handleBack() {
    navigation.goBack();
  }

  async function handleRegister() {
    if (!password || !passwordConfirm) {
      Alert.alert('Informe a senha e a confirmação');
    }

    if (password !== passwordConfirm) {
      Alert.alert('As senhas não são iguais');
    }

    await api
      .post('/users', {
        name: user.name,
        email: user.email,
        driver_license: user.driverLicense,
        password,
      })
      .then(() => {
        navigation.navigate('Confirmation', {
          title: 'Conta criada!',
          message: `Agora é só fazer login\ne aproveitar`,
          nextScreenRoute: 'SignIn',
        });
      })
      .catch(() => {
        Alert.alert('Opa', 'Não foi possível cadastrar, tente novamente');
      });
  }

  return (
    <KeyboardAvoidingView behavior='position' enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <BackButton onPress={handleBack} />

            <Steps>
              <Bullet active />
              <Bullet />
            </Steps>
          </Header>

          <Title>Crie usa {'\n'}conta</Title>
          <SubTitle>
            Faça seu cadastro de {'\n'}
            forma rápida e fácil
          </SubTitle>

          <Form>
            <FormTitle>2. Senha</FormTitle>

            <PasswordInput
              iconName='lock'
              placeholder='Senha'
              value={password}
              onChangeText={setPassword}
            />
            <PasswordInput
              iconName='lock'
              placeholder='Repetir Senha'
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
            />
          </Form>

          <Button
            color={theme.colors.success}
            title='Cadastrar'
            onPress={handleRegister}
          />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
