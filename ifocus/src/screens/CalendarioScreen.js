import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import Header from '../components/Header'
import { colors } from '../theme/colors'

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']
const SEMANAS = [
  [26, 27, 28, 29, 30, 31, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22],
  [23, 24, 25, 26, 27, 28, 1],
]

export default function CalendarioScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.monthTitle}>Fevereiro , 2024</Text>

        <View style={styles.table}>
          <View style={styles.row}>
            {DIAS_SEMANA.map((d) => (
              <Text key={d} style={styles.headCell}>{d}</Text>
            ))}
          </View>
          {SEMANAS.map((semana, i) => (
            <View style={styles.row} key={i}>
              {semana.map((dia, j) => {
                const foraDoMes = (i === 0 && dia > 20) || (i === 4 && dia < 23)
                const hoje = i === 3 && dia === 20
                return (
                  <View key={j} style={[styles.dayCell, hoje && styles.dayToday]}>
                    <Text style={[styles.dayText, foraDoMes && styles.dayOut, hoje && styles.dayTodayText]}>{dia}</Text>
                  </View>
                )
              })}
            </View>
          ))}
        </View>

        <View style={styles.timeline}>
          <Text style={styles.hourLabel}>07:00</Text>
          <View style={styles.block} />
          <Text style={styles.hourLabel}>14:00</Text>
          <View style={styles.block} />
          <View style={styles.block} />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  monthTitle: { textAlign: 'center', fontSize: 18, fontWeight: '700', marginBottom: 12, color: colors.text },
  table: { marginBottom: 10 },
  row: { flexDirection: 'row' },
  headCell: { flex: 1, textAlign: 'center', color: colors.muted, fontSize: 12, paddingVertical: 6 },
  dayCell: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  dayToday: { backgroundColor: colors.light, borderRadius: 999 },
  dayText: { fontSize: 13, color: colors.text },
  dayOut: { color: '#b7c2ae' },
  dayTodayText: { fontWeight: '700' },
  timeline: { marginTop: 20 },
  hourLabel: { fontSize: 13, color: colors.muted, marginTop: 10, marginBottom: 4 },
  block: { backgroundColor: colors.light, borderRadius: 10, height: 60, marginBottom: 8 },
})
