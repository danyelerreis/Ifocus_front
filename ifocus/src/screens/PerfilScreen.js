import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { colors } from '../theme/colors'

export default function PerfilScreen() {
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  async function handleAlterarSenha() {
    setMensagem('')

    if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
      setMensagem('Preencha todos os campos.')
      return
    }

    if (novaSenha !== confirmarNovaSenha) {
      setMensagem('A nova senha e a confirmação não coincidem.')
      return
    }

    setCarregando(true)
    try {
      // 1. Busca a senha armazenada localmente
      const senhaSalva = await SecureStore.getItemAsync('senhaUsuario')

      // 2. Verifica se a senha digitada pelo usuário BATE com a salva
      if (senhaSalva && senhaAtual !== senhaSalva) {
        setMensagem('A senha atual está incorreta.')
        setCarregando(false)
        return
      }

      // 3. Atualiza no SecureStore (e enviaria para a API em produção)
      await SecureStore.setItemAsync('senhaUsuario', novaSenha)

      Alert.alert('Sucesso!', 'Sua senha foi alterada com sucesso.')
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmarNovaSenha('')
    } catch (e) {
      setMensagem('Erro ao verificar ou alterar a senha.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Alterar Senha</Text>

      <View style={styles.field}>
        <TextInput
          style={styles.input}
          placeholder="Senha Atual"
          value={senhaAtual}
          onChangeText={setSenhaAtual}
          secureTextEntry
        />
      </View>

      <View style={styles.field}>
        <TextInput
          style={styles.input}
          placeholder="Nova Senha"
          value={novaSenha}
          onChangeText={setNovaSenha}
          secureTextEntry
        />
      </View>

      <View style={styles.field}>
        <TextInput
          style={styles.input}
          placeholder="Confirmar Nova Senha"
          value={confirmarNovaSenha}
          onChangeText={setConfirmarNovaSenha}
          secureTextEntry
        />
      </View>

      {!!mensagem && <Text style={styles.error}>{mensagem}</Text>}

      <TouchableOpacity style={styles.btnPrimary} onPress={handleAlterarSenha} disabled={carregando}>
        <Text style={styles.btnPrimaryText}>{carregando ? 'Salvando...' : 'Atualizar Senha'}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark, padding: 24 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 20 },
  field: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 },
  input: { paddingVertical: 12 },
  error: { color: '#ffb3b3', marginBottom: 10, textAlign: 'center' },
  btnPrimary: { backgroundColor: colors.light2, borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  btnPrimaryText: { color: colors.dark, fontWeight: '700' },
})