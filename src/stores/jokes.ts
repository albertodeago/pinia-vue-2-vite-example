import { ref, toRaw, unref } from '@vue/composition-api'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { getRandomJoke, Joke } from '../api/jokes'

export const useJokes = defineStore('jokes', {
  state: () => ({
    current: null as null | Joke,
    jokes: [] as Joke[],
  }),
  actions: {
    async fetchJoke() {
      if (
        this.current &&
        // if the request below fails, avoid adding it twice
        !this.jokes.find((joke) => this.current!.id === joke.id)
      ) {
        this.jokes.push(this.current)
      }

      this.current = await getRandomJoke()
      // this.$patch({ current: await getRandomJoke() })
    },
  },

  debounce: {
    fetchJoke: 0,
  },
})

export const useJokesSetup = defineStore('jokes-setup', () => {
  const current = ref<null | Joke>(null)
  const history = ref<Joke[]>([])

  async function fetchJoke() {
    const cur = unref(current.value)
    if (
      cur &&
      // if the request below fails, avoid adding it twice
      !history.value.find((joke) => joke.id === cur.id)
    ) {
      history.value.push(cur)
    }

    current.value = await getRandomJoke()
    return current.value
  }

  return { current, history, fetchJoke }
})

if (import.meta.hot) {
  // import.meta.hot.accept(acceptHMRUpdate(useJokes, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(useJokesSetup, import.meta.hot))
}
