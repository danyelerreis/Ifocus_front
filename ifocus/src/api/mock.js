import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * MODO DEMO (sem back-end)
 * ------------------------------------------------------------------
 * Simula o banco de dados usando AsyncStorage, só para o protótipo
 * rodar sozinho no celular/emulador, sem precisar do Spring no ar.
 *
 * Quando o back-end Spring estiver pronto, mude USE_MOCK para false
 * (arquivo src/api/config.js) que as chamadas passam a ir de verdade
 * para o Spring, através de client.js.
 * ------------------------------------------------------------------
 */
const KEY = 'study_app_db_v1'

const seed = {
  user: {
    nomeCompleto: 'Usuário da Silva',
    email: 'unknow2478@gmail.com',
    pais: 'Brasil',
    cidade: 'Rondonópolis',
  },
  eventos: [
    { id: 1, categoria: 'Pessoal', titulo: 'Estudar', data: '2024-02-20', inicio: '16:00', fim: '17:00' },
    { id: 2, categoria: 'Escola', titulo: 'Tarefa', data: '2024-02-20', inicio: '17:30', fim: '18:30' },
  ],
  kanban: {
    categorias: [
      { id: 'todo', nome: 'A Fazer', itens: ['Ler cap. 3', 'Resumo de História', 'Exercícios de Matemática', 'Revisar Inglês', 'Ler artigo', 'Fichamento', 'Slides'] },
      { id: 'doing', nome: 'Em Progresso', itens: ['Trabalho de Sociologia', 'Redação', 'Projeto de Física'] },
      { id: 'done', nome: 'Concluído', itens: ['Prova de Química', 'Lista 1', 'Lista 2', 'Seminário', 'Resumo', 'Exercícios'] },
    ],
  },
  pomodoro: {
    sessaoAtual: 23,
    tempoFoco: 25 * 60,
    tempoRelaxamento: 15 * 60,
    etapas: 6,
  },
  notificacoes: [
    { id: 1, titulo: 'Tarefa de Português está atrasada', quando: 'Agora' },
    { id: 2, titulo: 'Novo evento marcado', quando: '1min atrás' },
    { id: 3, titulo: 'Nova Atividade de Inglês adicionada', quando: '5min atrás' },
    { id: 4, titulo: 'Sessão de Estudos Concluída', quando: '12min atrás' },
  ],
  estatisticas: {
    materias: [
      { nome: 'Matemática', paraFazer: 5, totalHr: '1:48', feitas: 13 },
      { nome: 'Português', paraFazer: 4, totalHr: '0:57:12', feitas: 9 },
    ],
    serie: [12, 18, 14, 9, 15, 22, 17, 13, 19, 25],
  },
}

export async function loadDb() {
  const raw = await AsyncStorage.getItem(KEY)
  if (!raw) {
    await AsyncStorage.setItem(KEY, JSON.stringify(seed))
    return JSON.parse(JSON.stringify(seed))
  }
  return JSON.parse(raw)
}

export async function saveDb(db) {
  await AsyncStorage.setItem(KEY, JSON.stringify(db))
}

export const delay = (v) => new Promise((res) => setTimeout(() => res(v), 150))
