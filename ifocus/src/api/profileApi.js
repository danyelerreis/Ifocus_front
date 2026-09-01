import api from './client'
import { USE_MOCK } from './config'
import { loadDb, saveDb, delay } from './mock'

/**
 * Spring: UsuarioController
 *   GET /api/usuarios/me
 *   PUT /api/usuarios/me
 */
export async function buscarPerfil() {
  if (USE_MOCK) {
    await delay()
    const db = await loadDb()
    return db.user
  }
  const { data } = await api.get('/usuarios/me')
  return data
}

export async function atualizarPerfil(campos) {
  if (USE_MOCK) {
    await delay()
    const db = await loadDb()
    db.user = { ...db.user, ...campos }
    await saveDb(db)
    return db.user
  }
  const { data } = await api.put('/usuarios/me', campos)
  return data
}
