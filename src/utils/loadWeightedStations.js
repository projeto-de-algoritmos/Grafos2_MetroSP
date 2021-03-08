const fs = require('fs')

const stationsGraph = require('../assets/js/stationsGraph.json')

const loadStationsWeighted = () => {
  const stationsGraphWeighted = { ...stationsGraph }
  console.log(stationsGraph)
  for (let id of Object.keys(stationsGraphWeighted)) {
    let auxEdges = []
    stationsGraphWeighted[id].neighboringStations.forEach((neigh) => {
      let auxEdge = { weight: Math.floor(Math.random() * 10) + 1, node: neigh }
      auxEdges.push(auxEdge)
    })
    stationsGraphWeighted[id].neighboringStations = auxEdges
  }
  fs.writeFile(
    './src/assets/js/stationsGraphWeighted.json',
    JSON.stringify(stationsGraphWeighted),
    (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('Erro ao escrever JSON', err)
      } else {
        // eslint-disable-next-line no-console
        console.log('JSON escrito com sucesso')
      }
    }
  )
}

loadStationsWeighted()