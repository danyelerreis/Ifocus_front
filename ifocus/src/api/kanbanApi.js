import api from './client'
import { USE_MOCK } from './config'
import { loadDb, saveDb, delay } from './mock'

/**
 * Spring: KanbanController
 *   GET  /api/kanban
 *   POST /api/kanban/{categoriaId}/itens
 */
export async function buscarKanban() {
  if (USE_MOCK) {
    await delay()
    const db = await loadDb()
    return db.kanban
  }
  const { data } = await api.get('/kanban')
  return data
}

export async function adicionarItem(categoriaId, texto) {
  if (USE_MOCK) {
    await delay()
    const db = await loadDb()
    const cat = db.kanban.categorias.find((c) => c.id === categoriaId)
    cat.itens.push(texto)
    await saveDb(db)
    return db.kanban
  }
  const { data } = await api.post(`/kanban/${categoriaId}/itens`, { texto })
  return data
}
