import { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { buscarConfig, encerrarSessao } from '../api/pomodoroApi'
import Header from '../components/Header'
import { colors } from '../theme/colors'

function formatar(segundos) {
  const m = String(Math.floor(segundos / 60)).padStart(2, '0')
  const s = String(segundos % 60).padStart(2, '0')
  return `${m} : ${s}`
}

const RAIO = 88
const CIRCUNFERENCIA = 2 * Math.PI * RAIO

export default function PomodoroScreen({ navigation }) {
  const [config, setConfig] = useState(null)
  const [status, setStatus] = useState('parado') // parado | rodando | encerrada
  const [restante, setRestante] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    buscarConfig().then((c) => {
      setConfig(c)
      setRestante(c.tempoFoco)
    })
    return () => clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (status !== 'rodando') return
    intervalRef.current = setInterval(() => {
      setRestante((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current)
          setStatus('encerrada')
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [status])

  async function handleEncerrar() {
    clearInterval(intervalRef.current)
    await encerrarSessao(config?.sessaoAtual)
    setStatus('encerrada')
  }

  if (!config) {
    return (
      <View style={styles.container}>
        <Header navigation={navigation} />
        <Text style={{ padding: 20 }}>Carregando...</Text>
      </View>
    )
  }

  const progresso = restante / config.tempoFoco
  const offset = status === 'encerrada' ? 0 : CIRCUNFERENCIA * progresso

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.content}>
        <Text style={styles.sessionTitle}>Sessão de Estudos #{config.sessaoAtual}</Text>

        {status === 'rodando' && (
          <TouchableOpacity style={styles.pillSolid} onPress={handleEncerrar}>
            <Text style={styles.pillSolidText}>Encerrar</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.progressText}>
          {status !== 'encerrada'
            ? `${formatar(config.tempoFoco - restante)} / ${Math.round(config.tempoFoco / 60)}m 00s`
            : `${Math.round(config.tempoFoco / 60)}m 00s`}
        </Text>

        <View style={styles.ringWrap}>
          <Svg width={220} height={220} viewBox="0 0 200 200">
            <Circle cx="100" cy="100" r={RAIO} stroke={colors.light} strokeWidth={14} fill="none" />
            <Circle
              cx="100"
              cy="100"
              r={RAIO}
              stroke={colors.dark2}
              strokeWidth={14}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${CIRCUNFERENCIA} ${CIRCUNFERENCIA}`}
              strokeDashoffset={offset}
              rotation="-90"
              origin="100, 100"
            />
          </Svg>
          <View style={styles.ringCenter}>
            {status === 'parado' && (
              <TouchableOpacity onPress={() => setStatus('rodando')}>
                <Text style={styles.startText}>Iniciar</Text>
              </TouchableOpacity>
            )}
            {status === 'rodando' && (
              <Text style={styles.clockText}>{formatar(restante)}{'\n'}<Text style={styles.clockSub}>estude</Text></Text>
            )}
            {status === 'encerrada' && <Text style={styles.clockText}>Sessão{'\n'}Encerrada</Text>}
          </View>
        </View>

        <View style={styles.meta}>
          <View style={styles.metaRow}><Text>Tempo de Etapas de Foco</Text><Text style={styles.metaValue}>{formatar(config.tempoFoco)}</Text></View>
          <View style={styles.metaRow}><Text>Tempo de Etapas de Relaxamento</Text><Text style={styles.metaValue}>{formatar(config.tempoRelaxamento)}</Text></View>
          <View style={styles.metaRow}><Text>Quantidade total de Etapas</Text><Text style={styles.metaValue}>{config.etapas} etapas</Text></View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  sessionTitle: { fontSize: 16, color: colors.text, marginBottom: 10 },
  pillSolid: { backgroundColor: colors.dark2, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 18, marginBottom: 10 },
  pillSolidText: { color: '#fff', fontSize: 13 },
  progressText: { color: colors.muted, marginBottom: 20 },
  ringWrap: { width: 220, height: 220, alignItems: 'center', justifyContent: 'center' },
  ringCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  startText: { fontSize: 20, color: colors.dark },
  clockText: { fontSize: 24, fontWeight: '700', textAlign: 'center', color: colors.text },
  clockSub: { fontSize: 13, fontWeight: '400', color: colors.muted },
  meta: { width: '100%', marginTop: 26 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.08)' },
  metaValue: { fontWeight: '700' },
})
