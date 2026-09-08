import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../theme/colors'

export default function CriarContaScreen({ navigation }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)

  // Requisitos da Senha
  const regrasSenha = {
    tamanhoMinimo: senha.length >= 8,
    temNumero: /[0-9]/.test(senha),
  }
  const senhaEhValida = Object.values(regrasSenha).every(Boolean)

  // Verificação em tempo real de coincidência de senhas
  const senhasCoincidem = senha.length > 0 && senha === confirmarSenha

  async function realizarCadastro() {
    setErro('')

    if (!nome || !email || !senha || !confirmarSenha) {
      setErro('Por favor, preencha todos os campos.')
      return
    }

    if (!senhaEhValida) {
      setErro('A senha deve ter pelo menos 8 caracteres e 1 número.')
      return
    }

    if (!senhasCoincidem) {
      setErro('As senhas digitadas não coincidem.')
      return
    }

    setCarregando(true)
    try {
      // Chamada da API para criar a conta
      Alert.alert('Sucesso!', 'Conta criada com sucesso.')
      navigation.goBack()
    } catch (e) {
      setErro('Não foi possível criar a conta. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>NOVA CONTA</Text>
          <Text style={styles.heroSub}>Cadastre-se para organizar sua rotina de estudos</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Preencha seus dados</Text>

          <View style={styles.field}>
            <Text>👤</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text>📧</Text>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Campo Senha */}
          <View style={styles.field}>
            <Text>🔑</Text>
            <TextInput
              style={styles.input}
              placeholder="Crie uma senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
              <MaterialCommunityIcons
                name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Campo Confirmação */}
          <View style={styles.field}>
            <Text>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirme a senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!mostrarConfirmarSenha}
            />
            <TouchableOpacity onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}>
              <MaterialCommunityIcons
                name={mostrarConfirmarSenha ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Feedback Visual das Senhas */}
          {confirmarSenha.length > 0 && (
            <Text style={{ color: senhasCoincidem ? '#4CAF50' : '#ffb3b3', fontSize: 13, marginBottom: 10, textAlign: 'center' }}>
              {senhasCoincidem ? '✓ As senhas coincidem' : '✕ As senhas não coincidem'}
            </Text>
          )}

          {!!erro && <Text style={styles.error}>{erro}</Text>}

          <TouchableOpacity style={styles.btnPrimary} onPress={realizarCadastro} disabled={carregando}>
            <Text style={styles.btnPrimaryText}>{carregando ? 'Criando conta...' : 'Cadastrar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.link}>Já tenho conta! Voltar para Login</Text>
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
  error: { color: '#ffb3b3', marginBottom: 10, fontSize: 13, textAlign: 'center' },
  btnPrimary: { backgroundColor: colors.light2, borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  btnPrimaryText: { color: colors.dark, fontWeight: '700' },
  link: { color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 18 },
})