import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/LoginScreen'
import MainTabs from './MainTabs'
import CalendarioScreen from '../screens/CalendarioScreen'
import PerfilScreen from '../screens/PerfilScreen'
import NotificacoesScreen from '../screens/NotificacoesScreen'
import ConfigNotificacoesScreen from '../screens/ConfigNotificacoesScreen'

const Stack = createNativeStackNavigator()

/**
 * ======================================================================
 *  ROTAS DO APLICATIVO  ->  É AQUI que você adiciona/edita telas.
 * ======================================================================
 * Para criar uma tela nova:
 *   1. crie o arquivo em src/screens/NovaTela.js
 *   2. importe aqui em cima
 *   3. adicione <Stack.Screen name="NovaTela" component={NovaTela} />
 *   4. navegue até ela de qualquer lugar com:
 *        navigation.navigate('NovaTela')
 *
 * - "Login" é a primeira tela (sem menu inferior).
 * - "MainTabs" é o conjunto de abas (Painel, Foco, Tarefas, Análises) -
 *   definidas em src/navigation/MainTabs.js.
 * - Calendario, Perfil, Notificacoes e ConfigNotificacoes são telas que
 *   abrem "por cima" das abas (ex: ao tocar no sino 🔔 ou no card de
 *   perfil), por isso ficam no Stack e não no Tab.Navigator.
 * ======================================================================
 */
export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Calendario" component={CalendarioScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      <Stack.Screen name="Notificacoes" component={NotificacoesScreen} />
      <Stack.Screen name="ConfigNotificacoes" component={ConfigNotificacoesScreen} />
    </Stack.Navigator>
  )
}
