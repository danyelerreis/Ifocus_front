import { useState } from 'react'
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { colors } from '../theme/colors'

/**
 * Modal simples de "Criar conta" usado na tela de Login.
 * No mock, isso substitui o usuário de demonstração salvo no
 * AsyncStorage (src/api/mock.js). No Spring, chama
 * POST /api/auth/register (ver src/api/authApi.js -> register()).
 */
export default function RegisterModal({ visible, onCancel, onConfirm }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  function handleConfirmar() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setErro('Preencha nome, e-mail e senha.')
      return
    }
    setErro('')
    onConfirm({ nomeCompleto: nome.trim(), email: email.trim(), senha: senha.trim() })
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Criar conta</Text>

          <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

          {!!erro && <Text style={styles.error}>{erro}</Text>}

          <View style={styles.row}>
            <TouchableOpacity style={styles.btn} onPress={onCancel}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleConfirmar}>
              <Text style={[styles.btnText, styles.btnPrimaryText]}>Criar</Text>
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
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 12 },
  error: { color: '#a33', fontSize: 13, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 4 },
  btn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  btnPrimary: { backgroundColor: colors.dark2 },
  btnText: { color: colors.dark, fontWeight: '600' },
  btnPrimaryText: { color: '#fff' },
})