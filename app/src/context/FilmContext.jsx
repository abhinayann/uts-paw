
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

const FilmContext = createContext()

const STORAGE_KEY = 'koleksi-film'

export function FilmProvider({ children }) {
  const [film, setFilm] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dataReady, setDataReady] = useState(false)

  // Mengambil data awal dari JSON atau localStorage
  useEffect(() => {
    async function ambilDataFilm() {
      try {
        const response = await fetch('/data/koleksi.json')

        if (!response.ok) {
          throw new Error('Gagal mengambil data film')
        }

        const dataJSON = await response.json()
        const dataTersimpan = localStorage.getItem(STORAGE_KEY)

        if (dataTersimpan) {
          try {
            setFilm(JSON.parse(dataTersimpan))
          } catch {
            setFilm(dataJSON)
          }
        } else {
          setFilm(dataJSON)
        }

        setError('')
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
        setDataReady(true)
      }
    }

    ambilDataFilm()
  }, [])

  // Menyimpan perubahan koleksi ke localStorage
  useEffect(() => {
    if (dataReady) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(film))
    }
  }, [film, dataReady])

  // Menambahkan film baru
  function tambahFilm(filmBaru) {
    setFilm((filmSebelumnya) => {
      const idBaru =
        filmSebelumnya.length > 0
          ? Math.max(...filmSebelumnya.map((item) => item.id || 0)) + 1
          : 1

      return [
        ...filmSebelumnya,
        {
          ...filmBaru,
          id: idBaru,
        },
      ]
    })
  }

  // Menghapus film berdasarkan ID
  function hapusFilm(id) {
    setFilm((filmSebelumnya) =>
      filmSebelumnya.filter((item) => item.id !== Number(id))
    )
  }

  return (
    <FilmContext.Provider
      value={{
        film,
        tambahFilm,
        hapusFilm,
        loading,
        error,
      }}
    >
      {children}
    </FilmContext.Provider>
  )
}

export function useFilm() {
  return useContext(FilmContext)
}
