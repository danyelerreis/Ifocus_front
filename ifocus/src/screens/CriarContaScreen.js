import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../theme/colors'
// Caso tenha uma função de cadastro na sua API, importe-a aqui
// import { registrar } from '../api/authApi'

export default function CriarContaScreen({ navigation }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)

  async function realizarCadastro() {
    setErro('')
    
    // Validações básicas
    if (!nome || !email || !senha || !confirmarSenha) {
      setErro('Por favor, preencha todos os campos.')
      return
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setCarregando(true)
    try {
      // Aqui você vai chamar a sua API para criar a conta de verdade
      // Exemplo: await registrar(nome, email, senha)
      
      Alert.alert('Sucesso!', 'Conta criada com sucesso. Faça o login para acessar seus planos de estudo.')
      navigation.goBack() // Volta para a tela de login
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