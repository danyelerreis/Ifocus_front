import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * ======================================================================
 *  PONTO ÚNICO DE CONFIGURAÇÃO DA API (Spring Boot)
 * ======================================================================
 * No React Native NÃO existe proxy tipo o do Vite, então aponte direto
 * para o IP da máquina onde o Spring está rodando (não use "localhost"
 * ao testar em celular físico ou emulador — use o IP da sua rede,
 * ex: http://192.168.0.10:8080/api).
 *
 * No Spring, isso corresponde a um controller com:
 *   @RestController
 *   @RequestMapping("/api")
 *   @CrossOrigin(origins = "*") // ajuste em produção
 * ======================================================================
 */
const BASE_URL = 'http://192.168.0.10:8080/api' // <-- troque pelo IP do seu back-end

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await AsyncStorage.removeItem('token')
    }
    return Promise.reject(err)
  }
)

export default api
