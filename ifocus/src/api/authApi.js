import AsyncStorage from '@react-native-async-storage/async-storage'
import api from './client'
import { USE_MOCK } from './config'
import { loadDb, delay } from './mock'

/**
 * Spring: AuthController
 *   POST /api/auth/login   -> { token, user }
 */
export async function login(emailOuCpf, senha) {
  if (USE_MOCK) {
    await delay()
    const db = await loadDb()
    
    // Validação no Mock: verifica se email/cpf E senha conferem com o banco simulado
    const usuarioValido = db.user && 
      (db.user.email === emailOuCpf || db.user.cpf === emailOuCpf) && 
      db.user.senha === senha

    if (!usuarioValido) {
      throw new Error('E-mail/CPF ou senha incorretos.')
    }

    await AsyncStorage.setItem('token', 'demo-token')
    return { token: 'demo-token', user: db.user }
  }

  try {
    // Envia credenciais ao Spring Boot
    const { data } = await api.post('/auth/login', { emailOuCpf, senha })
    await AsyncStorage.setItem('token', data.token)
    return data
  } catch (error) {
    // Captura mensagem tratada do backend Spring (ex: 401/400)
    const mensagemErro = error.response?.data?.message || 'E-mail/CPF ou senha incorretos.'
    throw new Error(mensagemErro)
  }
}

export async function logout() {
  await AsyncStorage.removeItem('token')
  if (!USE_MOCK) await api.post('/auth/logout')
}