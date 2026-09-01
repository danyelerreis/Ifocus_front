import { useEffect, useState } from 'react'
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { listarNotificacoes } from '../api/notificationsApi'
import Header from '../components/Header'
import { colors } from '../theme/colors'

export default function NotificacoesScreen({ navigation }) {
  const [lista, setLista] = useState([])
  const [naoPerturbe, setNaoPerturbe] = useState(true)

  useEffect(() => { listarNotificacoes().then(setLista) }, [])

  return (
    <View style={styles.container}>
      <Header navigation={navigation} showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Notificações</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ConfigNotificacoes')}>
              <Text>⚙</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.switchInline}>
            <Text style={{ fontSize: 13 }}>Não perturbe</Text>
            <Switch value={naoPerturbe} onValueChange={setNaoPerturbe} />
          </View>
        </View>

        {lista.map((n) => (
          <View style={styles.row} key={n.id}>
            <View style={styles.dot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{n.titulo}</Text>
              <Text style={styles.muted}>{n.quando}</Text>
            </View>
          </View>
        ))}
        {lista.length > 0 && <Text style={[styles.muted, { textAlign: 'center', marginTop: 8 }]}>Fim das notificações</Text>}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  headerRow: { marginBottom: 10 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  switchInline: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  row: { flexDirection: 'row', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.dark2, marginTop: 6 },
  itemTitle: { fontWeight: '600', color: colors.text },
  muted: { color: colors.muted, fontSize: 12 },
})
