import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { login } from '../api/authApi'
import { colors } from '../theme/colors'

export default function LoginScreen({ navigation }) {
  const [emailOuCpf, setEmailOuCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrar, setLembrar] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleEntrar() {
    setErro('')
    setCarregando(true)
    try {
      await login(emailOuCpf, senha)
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })
    } catch (e) {
      setErro('Não foi possível entrar. Confira seus dados.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>BEM-VINDO DE VOLTA!</Text>
          <Text style={styles.heroSub}>Entre para continuar sua jornada de estudos</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Bem-vindo de volta!</Text>

          <View style={styles.field}>
            <Text>👤</Text>
            <TextInput
              style={styles.input}
              placeholder="E-mail ou CPF"
              value={emailOuCpf}
              onChangeText={setEmailOuCpf}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text>🔑</Text>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          <View style={styles.checkboxRow}>
            <Switch value={lembrar} onValueChange={setLembrar} />
            <Text style={styles.checkboxLabel}>Lembrar meus dados</Text>
          </View>

          {!!erro && <Text style={styles.error}>{erro}</Text>}

          <TouchableOpacity style={styles.btnPrimary} onPress={handleEntrar} disabled={carregando}>
            <Text style={styles.btnPrimaryText}>{carregando ? 'Entrando...' : 'Acessar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.link}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  hero: { backgroundColor: '#ece7da', alignItems: 'center', paddingTop: 70, paddingBottom: 50, paddingHorizontal: 24 },
  heroTitle: { color: colors.dark2, fontSize: 22, fontWeight: '700', textAlign: 'center' },
  heroSub: { color: colors.muted, marginTop: 8 },
  panel: { flex: 1, backgroundColor: colors.dark, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, padding: 26, paddingTop: 30 },
  panelTitle: { color: '#fff', textAlign: 'center', fontSize: 16, marginBottom: 16 },
  field: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 },
  input: { flex: 1, paddingVertical: 12, marginLeft: 6 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  checkboxLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  error: { color: '#ffb3b3', marginBottom: 10, fontSize: 13 },
  btnPrimary: { backgroundColor: colors.light2, borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  btnPrimaryText: { color: colors.dark, fontWeight: '700' },
  link: { color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 14 },
})
