import api from './client'
import { USE_MOCK } from './config'
import { loadDb, delay } from './mock'

/**
 * Spring: EstatisticaController
 *   GET /api/estatisticas?periodo=1d|1s|2s|3s|1m
 */
export async function buscarEstatisticas(periodo) {
  if (USE_MOCK) {
    await delay()
    const db = await loadDb()
    return db.estatisticas
  }
  const { data } = await api.get('/estatisticas', { params: { periodo } })
  return data
}
