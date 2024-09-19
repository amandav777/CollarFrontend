import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined; // Adapte conforme suas rotas
  Person: { userId: number };
  NotFound: undefined;

  // Outras rotas
};
