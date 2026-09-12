import { useState, useEffect } from 'react'
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { colors } from '../theme/colors'

/**
 * <PromptModal
 *   visible={aberto}
 *   title="Novo evento"
 *   placeholder="Nome do evento"
 *   onCancel={() => setAberto(false)}
 *   onConfirm={(texto) => { ...salvar...; setAberto(false) }}
 * />
 *
 * Substitui Alert.prompt (que só existe no iOS) por algo que funciona
 * igual em Android e iOS.
 */
export default function PromptModal({ visible, title, placeholder, initialValue = '', onCancel, onConfirm }) {
  const [valor, setValor] = useState(initialValue)

  useEffect(() => {
    if (visible) setValor(initialValue)
  }, [visible, initialValue])

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            style={styles.input}
            value={valor}
            onChangeText={setValor}
            placeholder={placeholder}
            autoFocus
          />
          <View style={styles.row}>
            <TouchableOpacity style={styles.btn} onPress={onCancel}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary]}
              onPress={() => valor.trim() && onConfirm(valor.trim())}
            >
              <Text style={[styles.btnText, styles.btnPrimaryText]}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 30 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 20 },
  title: { fontWeight: '700', fontSize: 15, marginBottom: 12, color: colors.text },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  btn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  btnPrimary: { backgroundColor: colors.dark2 },
  btnText: { color: colors.dark, fontWeight: '600' },
  btnPrimaryText: { color: '#fff' },
})
