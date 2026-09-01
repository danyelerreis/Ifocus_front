import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native'
import { buscarKanban, adicionarItem } from '../api/kanbanApi'
import Header from '../components/Header'
import { colors } from '../theme/colors'

export default function KanbanScreen({ navigation }) {
  const [board, setBoard] = useState(null)
  const [aberta, setAberta] = useState({})

  useEffect(() => { buscarKanban().then(setBoard) }, [])

  async function handleAdicionar(categoriaId) {
    if (Platform.OS === 'ios' && Alert.prompt) {
      Alert.prompt('Novo item', 'Descrição:', async (texto) => {
        if (!texto) return
        setBoard(await adicionarItem(categoriaId, texto))
      })
    } else {
      setBoard(await adicionarItem(categoriaId, 'Novo item'))
    }
  }

  if (!board) {
    return (
      <View style={styles.container}>
        <Header navigation={navigation} />
        <Text style={{ padding: 20 }}>Carregando...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>Utilidades</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Método Kanban</Text>
          <Text>✎</Text>
        </View>
        <Text style={styles.muted}>{board.categorias.length} Categorias</Text>

        {board.categorias.map((cat) => (
          <View style={styles.col} key={cat.id}>
            <TouchableOpacity
              style={styles.colHeader}
              onPress={() => setAberta((a) => ({ ...a, [cat.id]: !a[cat.id] }))}
            >
              <View>
                <Text style={styles.colHeaderText}>{cat.nome}</Text>
                <Text style={styles.colHeaderSub}>{cat.itens.length} Itens</Text>
              </View>
              <Text style={styles.colHeaderText}>{aberta[cat.id] ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {aberta[cat.id] && (
              <View style={styles.colBody}>
                {cat.itens.map((item, i) => (
                  <Text key={i} style={styles.item}>{item}</Text>
                ))}
                <TouchableOpacity onPress={() => handleAdicionar(cat.id)}>
                  <Text style={styles.addLink}>+ adicionar item</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  eyebrow: { fontSize: 12, fontWeight: '600', color: colors.dark },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  muted: { color: colors.muted, marginBottom: 14 },
  col: { marginBottom: 10, borderRadius: 10, overflow: 'hidden' },
  colHeader: { backgroundColor: colors.light, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  colHeaderText: { fontWeight: '700', color: colors.text },
  colHeaderSub: { fontSize: 12, color: colors.muted },
  colBody: { backgroundColor: '#f6f8ef', padding: 14 },
  item: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)', borderStyle: 'dashed', fontSize: 13 },
  addLink: { marginTop: 8, color: colors.dark2, fontWeight: '600' },
})
