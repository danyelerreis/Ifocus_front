import api from './client'
import { USE_MOCK } from './config'
import { loadDb, delay } from './mock'

/**
 * Spring: SessaoEstudoController
 *   GET  /api/sessoes/config
 *   POST /api/sessoes/{id}/encerrar
 */
export async function buscarConfig() {
  if (USE_MOCK) {
    await delay()
    const db = await loadDb()
    return db.pomodoro
  }
  const { data } = await api.get('/sessoes/config')
  return data
}

export async function encerrarSessao(id) {
  if (USE_MOCK) {
    await delay()
    return { id, status: 'ENCERRADA' }
  }
  const { data } = await api.post(`/sessoes/${id}/encerrar`)
  return data
}
