const scenes = [
    {
      id: 1,
      name: 'Just Chatting',
      image: '/images/scenes/1.png'
    },
    {
      id: 2,
      name: 'Ingame',
      image: '/images/scenes/2.png'
    },
    {
      id: 3,
      name: 'BRB',
      image: '/images/scenes/3.png'
    },
    {
      id: 4,
      name: 'Pause',
      image: '/images/scenes/1.png'
    },
    {
      id: 5,
      name: 'IRL',
      image: '/images/scenes/2.png'
    },
    {
      id: 6,
      name: 'Ingame 2',
      image: '/images/scenes/3.png'
    }
  ]

export function useScenes() {
  return {
    scenes,
  }
}