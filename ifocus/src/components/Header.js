import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors } from '../theme/colors'

export default function Header({ navigation, showBack, title, onBellPress }) {
  return (
    <View style={styles.row}>
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.icon}>←</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.openDrawer?.()}>
          <Text style={styles.icon}>☰</Text>
        </TouchableOpacity>
      )}
      {title ? <Text style={styles.title}>{title}</Text> : <View />}
      <TouchableOpacity onPress={onBellPress || (() => navigation.navigate('Notificacoes'))}>
        <Text style={styles.icon}>🔔</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 10,
    backgroundColor: colors.bg,
  },
  icon: { fontSize: 22, color: colors.dark },
  title: { fontSize: 16, fontWeight: '600', color: colors.dark },
})
