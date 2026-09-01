import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native'
import { buscarPerfil, atualizarPerfil } from '../api/profileApi'
import Header from '../components/Header'
import { colors } from '../theme/colors'

export default function PerfilScreen({ navigation }) {
  const [perfil, setPerfil] = useState(null)
  const [verSenha, setVerSenha] = useState(false)

  useEffect(() => { buscarPerfil().then(setPerfil) }, [])

  async function handleEditarEmail() {
    if (Platform.OS === 'ios' && Alert.prompt) {
      Alert.prompt('Novo e-mail', '', async (novo) => {
        if (!novo) return
        setPerfil(await atualizarPerfil({ email: novo }))
      }, 'plain-text', perfil.email)
    }
  }

  if (!perfil) {
    return (
      <View style={styles.container}>
        <Header navigation={navigation} showBack />
        <Text style={{ padding: 20 }}>Carregando...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} showBack title="Perfil" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatarCircle}><Text style={{ fontSize: 34 }}>👤</Text></View>
          <View style={styles.avatarCam}><Text>📷</Text></View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Nome Completo</Text>
          <Text style={styles.value}>{perfil.nomeCompleto}</Text>
        </View>

        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Email</Text>
            <TouchableOpacity onPress={handleEditarEmail}><Text>✎</Text></TouchableOpacity>
          </View>
          <Text style={styles.value}>{perfil.email}</Text>
        </View>

        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Senha</Text>
            <TouchableOpacity onPress={() => setVerSenha((v) => !v)}><Text>{verSenha ? '🙈' : '👁'}</Text></TouchableOpacity>
          </View>
          <Text style={styles.value}>{verSenha ? 'senha123' : '**********'}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>País</Text>
          <Text style={styles.value}>{perfil.pais}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Cidade/Município</Text>
          <Text style={styles.value}>{perfil.cidade}</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  avatarWrap: { alignSelf: 'center', marginVertical: 20 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.dark2, alignItems: 'center', justifyContent: 'center' },
  avatarCam: { position: 'absolute', bottom: -4, right: -4, backgroundColor: '#fff', borderRadius: 12, padding: 4 },
  field: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontWeight: '700', fontSize: 14, color: colors.text },
  value: { marginTop: 4, color: colors.muted },
})
