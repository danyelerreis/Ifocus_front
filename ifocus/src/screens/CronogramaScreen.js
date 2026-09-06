import { useEffect, useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, TextInput, Switch} from 'react-native'
import { listarEventos, criarEvento, removerEvento } from '../api/eventsApi'
import Header from '../components/Header'
import { colors } from '../theme/colors'

const HOJE = '2024-02-20'
const CATEGORIAS = ['Todos', 'Pessoal', 'Escola']
const CATEGORIAS_FORM = ['Pessoal', 'Escola']

export default function CronogramaScreen({ navigation }) {
  const [eventos, setEventos] = useState([])
  const [filtro, setFiltro] = useState('Todos')
  const [carregando, setCarregando] = useState(true)
  const [modalVisivel, setModalVisivel] = useState(false)
  const [mostrarSeletorCategoria, setMostrarSeletorCategoria] = useState(false)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoriaForm, setCategoriaForm] = useState('Pessoal')
  const [notificar, setNotificar] = useState(true)

  const carregar = useCallback(() => {
    listarEventos(HOJE).then((r) => {
      setEventos(r)
      setCarregando(false)
    })
  }, [])

  useEffect(() => { carregar() }, [carregar])

  function abrirModal() {
    setNome('')
    setDescricao('')
    setCategoriaForm('Pessoal')
    setNotificar(true)
    setMostrarSeletorCategoria(false)
    setModalVisivel(true)
  }

  function fecharModal() {
    setModalVisivel(false)
    setMostrarSeletorCategoria(false)
  }

  async function handleCriar() {
    if (!nome.trim()) {
      Alert.alert('Ops', 'Dê um nome para o compromisso.')
      return
    }
    const novo = await criarEvento({
      categoria: categoriaForm,
      titulo: nome.trim(),
      descricao: descricao.trim(),
      notificar,
      data: HOJE,
      inicio: '19:00',
      fim: '20:00',
    })
    setEventos((prev) => [...prev, novo])
    fecharModal()
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
          <TouchableOpacity style={[styles.chip, styles.chipOutline]} onPress={abrirModal}>
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
          <TouchableOpacity style={styles.fab} onPress={abrirModal}>
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal visible={modalVisivel} animationType="slide" transparent onRequestClose={fecharModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Adicionar Compromisso</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do Compromisso"
              placeholderTextColor={colors.muted}
              value={nome}
              onChangeText={setNome}
            />

            <TextInput
              style={[styles.input, styles.inputArea]}
              placeholder="Descrição"
              placeholderTextColor={colors.muted}
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={4}
            />

            <View style={styles.escolherRow}>
              <Text style={styles.escolherLabel}>Escolher Compromisso</Text>
              <TouchableOpacity
                style={styles.escolherBtn}
                onPress={() => setMostrarSeletorCategoria((v) => !v)}
              >
                <Text style={styles.escolherBtnText}>{categoriaForm}</Text>
              </TouchableOpacity>
            </View>

            {mostrarSeletorCategoria && (
              <View style={styles.categoriaOpcoes}>
                {CATEGORIAS_FORM.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.categoriaOpcao, categoriaForm === c && styles.categoriaOpcaoAtiva]}
                    onPress={() => {
                      setCategoriaForm(c)
                      setMostrarSeletorCategoria(false)
                    }}
                  >
                    <Text style={[styles.categoriaOpcaoText, categoriaForm === c && styles.categoriaOpcaoTextAtiva]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.notificarRow}>
              <Text style={styles.escolherLabel}>Me Notificar</Text>
              <Switch
                value={notificar}
                onValueChange={setNotificar}
                trackColor={{ false: colors.light2, true: colors.mid }}
                thumbColor={colors.white}
              />
            </View>

            <TouchableOpacity style={styles.criarBtn} onPress={handleCriar}>
              <Text style={styles.criarBtnText}>Criar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelarBtn} onPress={fecharModal}>
              <Text style={styles.cancelarBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.bg, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 22, paddingBottom: 32 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 18 },
  input: { backgroundColor: colors.light2, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14, color: colors.text },
  inputArea: { minHeight: 90, textAlignVertical: 'top' },
  escolherRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  escolherLabel: { color: colors.text, fontWeight: '600' },
  escolherBtn: { backgroundColor: colors.dark2, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  escolherBtnText: { color: '#fff', fontWeight: '600' },
  categoriaOpcoes: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  categoriaOpcao: { borderWidth: 1, borderColor: colors.dark2, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
  categoriaOpcaoAtiva: { backgroundColor: colors.dark2 },
  categoriaOpcaoText: { color: colors.dark2, fontSize: 13 },
  categoriaOpcaoTextAtiva: { color: '#fff' },
  notificarRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 24 },
  criarBtn: { backgroundColor: colors.mid, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  criarBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  cancelarBtn: { alignItems: 'center', paddingVertical: 4 },
  cancelarBtnText: { color: colors.muted, fontSize: 13 },
})