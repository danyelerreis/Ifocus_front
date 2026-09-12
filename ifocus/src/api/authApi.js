import AsyncStorage from '@react-native-async-storage/async-storage'
import api from './client'
import { USE_MOCK } from './config'
import { loadDb, saveDb, delay } from './mock'

/**
 * Spring: AuthController
 *   POST /api/auth/login    -> { token, user }
 *   POST /api/auth/register -> { token, user }
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
    const { data } = await api.post('/auth/login', { emailOuCpf, senha })
    await AsyncStorage.setItem('token', data.token)
    return data
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'E-mail/CPF ou senha incorretos.'
    throw new Error(mensagemErro)
  }
}

/**
 * Cria (ou substitui, neste mock de usuário único) a conta de demonstração
 * e já efetua o login com ela.
 *
 * No Spring: POST /api/auth/register recebe os mesmos campos e deve
 * validar e-mail duplicado antes de salvar.
 */
export async function register({ nomeCompleto, email, senha, cpf = '', pais = 'Brasil', cidade = '' }) {
  if (USE_MOCK) {
    await delay()
    const db = await loadDb()
    db.user = { nomeCompleto, email, senha, cpf, pais, cidade }
    await saveDb(db)
    await AsyncStorage.setItem('token', 'demo-token')
    return { token: 'demo-token', user: db.user }
  }

  try {
    const { data } = await api.post('/auth/register', { nomeCompleto, email, senha, cpf, pais, cidade })
    await AsyncStorage.setItem('token', data.token)
    return data
  } catch (error) {
    const mensagemErro = error.response?.data?.message || 'Não foi possível criar a conta.'
    throw new Error(mensagemErro)
  }
}

export async function logout() {
  await AsyncStorage.removeItem('token')
  if (!USE_MOCK) await api.post('/auth/logout')
}