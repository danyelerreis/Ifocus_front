import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors } from '../theme/colors'

const ITENS = [
  { label: 'Painel', route: 'MainTabs', screen: 'Painel' },
  { label: 'Calendário', route: 'Calendario' },
  { label: 'Perfil', route: 'Perfil' },
  { label: 'Notificações', route: 'Notificacoes' },
]

/**
 * Menu lateral (acionado pelo ☰ do Header). Não é um Drawer de verdade
 * do react-navigation — é um modal simples com links, o suficiente
 * para navegar entre as telas do Stack em src/navigation/RootNavigator.js.
 * Se quiser um drawer deslizante "de verdade", troque por
 * @react-navigation/drawer.
 */
export default function SideMenu({ visible, onClose, navigation, onLogout }) {
  function irPara(item) {
    onClose()
    if (item.screen) {
      navigation.navigate(item.route, { screen: item.screen })
    } else {
      navigation.navigate(item.route)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.panel}>
          {ITENS.map((item) => (
            <TouchableOpacity key={item.label} style={styles.item} onPress={() => irPara(item)}>
              <Text style={styles.itemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              onClose()
              onLogout()
            }}
          >
            <Text style={[styles.itemText, styles.logout]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  panel: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 230, backgroundColor: colors.bg, paddingTop: 70, paddingHorizontal: 20 },
  item: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)' },
  itemText: { fontSize: 15, color: colors.text, fontWeight: '600' },
  logout: { color: '#a33' },
})
