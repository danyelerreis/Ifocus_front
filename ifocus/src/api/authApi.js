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
    await AsyncStorage.setItem('token', 'demo-token')
    return { token: 'demo-token', user: db.user }
  }
  const { data } = await api.post('/auth/login', { emailOuCpf, senha })
  await AsyncStorage.setItem('token', data.token)
  return data
}

export async function logout() {
  await AsyncStorage.removeItem('token')
  if (!USE_MOCK) await api.post('/auth/logout')
}
