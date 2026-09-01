import api from './client'
import { USE_MOCK } from './config'
import { loadDb, delay } from './mock'

/**
 * Spring: NotificacaoController
 *   GET /api/notificacoes
 *   PUT /api/notificacoes/config
 */
export async function listarNotificacoes() {
  if (USE_MOCK) {
    await delay()
    const db = await loadDb()
    return db.notificacoes
  }
  const { data } = await api.get('/notificacoes')
  return data
}

export async function salvarPreferencias(prefs) {
  if (USE_MOCK) {
    await delay()
    return prefs
  }
  const { data } = await api.put('/notificacoes/config', prefs)
  return data
}
