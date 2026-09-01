import api from './client'
import { USE_MOCK } from './config'
import { loadDb, saveDb, delay } from './mock'

/**
 * Spring: EventoController
 *   GET    /api/eventos?data=2024-02-20
 *   POST   /api/eventos
 *   DELETE /api/eventos/{id}
 */
export async function listarEventos(data) {
  if (USE_MOCK) {
    await delay()
    const db = await loadDb()
    return db.eventos.filter((e) => e.data === data)
  }
  const { data: res } = await api.get('/eventos', { params: { data } })
  return res
}

export async function criarEvento(evento) {
  if (USE_MOCK) {
    await delay()
    const db = await loadDb()
    const novo = { ...evento, id: Date.now() }
    db.eventos.push(novo)
    await saveDb(db)
    return novo
  }
  const { data } = await api.post('/eventos', evento)
  return data
}

export async function removerEvento(id) {
  if (USE_MOCK) {
    await delay()
    const db = await loadDb()
    db.eventos = db.eventos.filter((e) => e.id !== id)
    await saveDb(db)
    return true
  }
  await api.delete(`/eventos/${id}`)
  return true
}
