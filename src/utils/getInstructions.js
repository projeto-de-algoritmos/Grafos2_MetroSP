/* eslint-disable */
const stationsGraph = require('../assets/js/stationsGraph.json')

const distances = new Array(150)
const parents = new Array(150)
const visited = new Array(150)

const BFS = (startStation, endStation) => {
  const queue = []

  queue.push(stationsGraph[startStation])
  distances.fill('Infinity')
  parents.fill(-1)
  visited.fill(false)

  visited[startStation] = true
  distances[startStation] = 0

  while (queue.length > 0) {
    const currentNode = queue[0]
    queue.shift()

    if (currentNode.id === endStation) {
      return true
    }

    currentNode.neighboringStations.forEach((neigh) => {
      if (visited[neigh] === false) {
        distances[neigh] = distances[currentNode.id] + 1
        parents[neigh] = currentNode.id

        visited[neigh] = true
        queue.push(stationsGraph[neigh])
      }
    })
  }

  return false
}

export const getInstructions = (startStation, endStation, tourMode) => {
  const mensagens = []

  if (!BFS(startStation, endStation)) {
    mensagens.push('Rota não encontrada')
    return mensagens
  }

  const path = []
  let parent = stationsGraph[endStation].id

  while (parent !== stationsGraph[startStation].id) {
    path.unshift(stationsGraph[parent])
    parent = parents[parent]
  }
  path.unshift(stationsGraph[parent])

  mensagens.push(`Embarque em ${path[0].stationName} sentido à estação ${path[1].stationName}`)
  for (let i = 1; i < path.length - 1; i += 1) {
    if (path[i].lineName === 'Estação de Integração') {
      mensagens.push(`Na estação ${path[i].stationName} siga sentido à estação ${path[i + 1].stationName}`)
    }
  }
  mensagens.push(`Desembarque em ${path[path.length - 1].stationName}`)

  return mensagens
}
