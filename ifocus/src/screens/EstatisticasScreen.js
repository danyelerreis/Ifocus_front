import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
import { buscarEstatisticas } from '../api/statsApi'
import Header from '../components/Header'
import { colors } from '../theme/colors'

const PERIODOS = [
  { id: '1d', label: '1 dia' },
  { id: '1s', label: '1 semana' },
  { id: '2s', label: '2 semana' },
  { id: '3s', label: '3 semana' },
  { id: '1m', label: '1 mês' },
]

export default function EstatisticasScreen({ navigation }) {
  const [dados, setDados] = useState(null)
  const [periodo, setPeriodo] = useState('1d')

  useEffect(() => { buscarEstatisticas(periodo).then(setDados) }, [periodo])

  if (!dados) {
    return (
      <View style={styles.container}>
        <Header navigation={navigation} />
        <Text style={{ padding: 20 }}>Carregando...</Text>
      </View>
    )
  }

  const serie = dados.serie
  const max = Math.max(...serie)
  const min = Math.min(...serie)
  const pontos = serie
    .map((v, i) => {
      const x = (i / (serie.length - 1)) * 340
      const y = 100 - ((v - min) / (max - min || 1)) * 90
      return `${x},${y}`
    })
    .join(' ')

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Estatísticas</Text>
          <Text style={styles.muted}>Análises</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {PERIODOS.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.chip, periodo === p.id && styles.chipActive]}
              onPress={() => setPeriodo(p.id)}
            >
              <Text style={[styles.chipText, periodo === p.id && styles.chipTextActive]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsRow}>
          {dados.materias.map((m) => (
            <View style={styles.card} key={m.nome}>
              <Text style={styles.cardTitle}>{m.nome}</Text>
              <View style={styles.cardRow}><Text style={styles.cardLabel}>Para Fazer</Text><Text>{m.paraFazer}</Text></View>
              <View style={styles.cardRow}><Text style={styles.cardLabel}>Total Hr.</Text><Text>{m.totalHr}</Text></View>
              <View style={styles.cardRow}><Text style={styles.cardLabel}>Feitas</Text><Text>{m.feitas}</Text></View>
            </View>
          ))}
        </ScrollView>

        <Svg width="100%" height={120} viewBox="0 0 340 110">
          <Polyline points={pontos} fill="none" stroke={colors.dark2} strokeWidth={2} />
        </Svg>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  muted: { color: colors.muted },
  chipRow: { marginVertical: 12 },
  chip: { borderWidth: 1, borderColor: colors.dark, backgroundColor: '#fff', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14, marginRight: 8 },
  chipActive: { backgroundColor: colors.dark2, borderColor: colors.dark2 },
  chipText: { color: colors.dark, fontSize: 13 },
  chipTextActive: { color: '#fff' },
  cardsRow: { marginBottom: 14 },
  card: { backgroundColor: colors.light, borderRadius: 12, padding: 12, minWidth: 150, marginRight: 10 },
  cardTitle: { fontWeight: '700', marginBottom: 4 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  cardLabel: { fontSize: 12, color: colors.muted },
})
