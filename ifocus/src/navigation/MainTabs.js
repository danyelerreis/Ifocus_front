import { Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import CronogramaScreen from '../screens/CronogramaScreen'
import PomodoroScreen from '../screens/PomodoroScreen'
import KanbanScreen from '../screens/KanbanScreen'
import EstatisticasScreen from '../screens/EstatisticasScreen'
import { colors } from '../theme/colors'

const Tab = createBottomTabNavigator()

const ICONES = {
  Painel: '▦',
  Foco: '⏱',
  Tarefas: '📋',
  Análises: '📊',
}

/**
 * TABS (menu inferior) — é aqui que você adiciona uma aba nova:
 *   <Tab.Screen name="NomeDaAba" component={SuaTela} />
 * O Cronograma abre a tela de Calendário via navigation.navigate('Calendario'),
 * que fica registrada no RootNavigator (stack), não aqui.
 */
export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: colors.dark, borderTopWidth: 0, height: 64, paddingTop: 8 },
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.55 }}>{ICONES[route.name]}</Text>
        ),
      })}
    >
      <Tab.Screen name="Painel" component={CronogramaScreen} />
      <Tab.Screen name="Foco" component={PomodoroScreen} />
      <Tab.Screen name="Tarefas" component={KanbanScreen} />
      <Tab.Screen name="Análises" component={EstatisticasScreen} />
    </Tab.Navigator>
  )
}
