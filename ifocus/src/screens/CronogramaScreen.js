import { useEffect, useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native'
import { listarEventos, criarEvento, removerEvento } from '../api/eventsApi'
import Header from '../components/Header'
import { colors } from '../theme/colors'

const HOJE = '2024-02-20'
const CATEGORIAS = ['Todos', 'Pessoal', 'Escola']

export default function CronogramaScreen({ navigation }) {
  const [eventos, setEventos] = useState([])
  const [filtro, setFiltro] = useState('Todos')
  const [carregando, setCarregando] = useState(true)

  const carregar = useCallback(() => {
    listarEventos(HOJE).then((r) => {
      setEventos(r)
      setCarregando(false)
    })
  }, [])

  useEffect(() => { carregar() }, [carregar])

  async function handleNovo() {
    if (Platform.OS === 'ios' && Alert.prompt) {
      Alert.prompt('Novo evento', 'Nome do evento:', async (titulo) => {
        if (!titulo) return
        const novo = await criarEvento({ categoria: 'Pessoal', titulo, data: HOJE, inicio: '19:00', fim: '20:00' })
        setEventos((prev) => [...prev, novo])
      })
    } else {
      const novo = await criarEvento({ categoria: 'Pessoal', titulo: 'Novo evento', data: HOJE, inicio: '19:00', fim: '20:00' })
      setEventos((prev) => [...prev, novo])
    }
  }

  function handleRemover(id) {
    Alert.alert('Remover evento', 'Deseja remover este evento?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: async () => {
        await removerEvento(id)
        setEventos((prev) => prev.filter((e) => e.id !== id))
      } },
    ])
  }

  const visiveis = filtro === 'Todos' ? eventos : eventos.filter((e) => e.categoria === filtro)

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>Cronograma</Text>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.pillSolid}><Text style={styles.pillSolidText}>Hoje</Text></View>
        </View>
        <Text style={styles.dateTitle}>Sábado</Text>
        <Text style={styles.dateSub}>20 Fevereiro</Text>

        <View style={styles.chipRow}>
          {CATEGORIAS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, filtro === c && styles.chipActive]}
              onPress={() => setFiltro(c)}
            >
              <Text style={[styles.chipText, filtro === c && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.chip, styles.chipOutline]} onPress={handleNovo}>
            <Text style={styles.chipText}>+ Novo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardPanel}>
          <Text style={styles.cardHeader}>{visiveis.length} Eventos</Text>
          {carregando && <Text>Carregando...</Text>}
          {!carregando && visiveis.length === 0 && <Text>Nenhum evento para hoje.</Text>}
          {visiveis.map((ev) => (
            <TouchableOpacity key={ev.id} style={styles.eventRow} onLongPress={() => handleRemover(ev.id)}>
              <Text style={styles.eventCat}>{ev.categoria}</Text>
              <Text style={styles.eventTitle}>{ev.titulo}</Text>
              <Text style={styles.eventTime}>🕐 {ev.inicio} - {ev.fim}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.fab} onPress={handleNovo}>
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  eyebrow: { fontSize: 12, fontWeight: '600', color: colors.dark, marginBottom: 8 },
  pillSolid: { backgroundColor: colors.dark2, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 18 },
  pillSolidText: { color: '#fff', fontSize: 13 },
  dateTitle: { textAlign: 'center', fontSize: 22, fontWeight: '700', marginTop: 10, color: colors.text },
  dateSub: { textAlign: 'center', color: colors.muted, marginBottom: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: { borderWidth: 1, borderColor: colors.dark, backgroundColor: '#fff', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
  chipActive: { backgroundColor: colors.dark2, borderColor: colors.dark2 },
  chipOutline: { borderStyle: 'dashed' },
  chipText: { color: colors.dark, fontSize: 13 },
  chipTextActive: { color: '#fff' },
  cardPanel: { backgroundColor: colors.light, borderRadius: 14, padding: 14 },
  cardHeader: { fontWeight: '700', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)', paddingBottom: 8, marginBottom: 8 },
  eventRow: { borderLeftWidth: 3, borderLeftColor: colors.dark2, paddingVertical: 8, paddingLeft: 10, marginBottom: 8 },
  eventCat: { fontSize: 12, color: colors.muted },
  eventTitle: { fontWeight: '700', color: colors.text },
  eventTime: { fontSize: 12, marginTop: 4, color: colors.text },
  fab: { backgroundColor: colors.dark2, borderRadius: 999, paddingVertical: 10, alignItems: 'center', marginTop: 4 },
  fabText: { color: '#fff', fontSize: 16 },
})
