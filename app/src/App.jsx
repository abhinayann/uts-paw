
import { useEffect, useState } from 'react'
import {
  Link,
  NavLink,
  Route,
  Routes,
  useParams,
  useNavigate,
} from 'react-router-dom'
import mahasiswa from '../mahasiswa.json'
import { FilmProvider, useFilm } from './context/FilmContext'
import './App.css'

function Beranda() {
  return (
    <main>
      <h1>Daftar Tontonan Film dan Serial</h1>
      <p>
        {mahasiswa.nama || 'Nama belum diisi'} (
        {mahasiswa.nim || 'NIM belum diisi'})
      </p>
      <Link to="/koleksi">Lihat Koleksi Film</Link>
    </main>
  )
}


function Koleksi() {
  const { film, loading, error } = useFilm()
  const [kataKunci, setKataKunci] = useState('')

  const hasilPencarian = film.filter((item) =>
    item.judul.toLowerCase().includes(kataKunci.toLowerCase())
  )

  return (
    <main>
      <h1>Koleksi Film dan Serial</h1>

      <Link to="/">Kembali ke Beranda</Link>

      <p>
        <Link to="/statistik">Lihat Statistik</Link>
      </p>

      <label htmlFor="pencarian">Cari film atau serial:</label>
      <input
        id="pencarian"
        type="text"
        placeholder="Masukkan judul film..."
        value={kataKunci}
        onChange={(event) => setKataKunci(event.target.value)}
      />

      {loading && <p>Memuat koleksi...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && hasilPencarian.length === 0 && (
        <p>Film atau serial tidak ditemukan.</p>
      )}

      {!loading &&
        !error &&
        hasilPencarian.map((item) => (
          <article key={item.id}>
            <h2>{item.judul}</h2>
            <p>Kategori: {item.kategori}</p>
            <p>Sutradara: {item.sutradara}</p>
            <p>Tahun Rilis: {item.tahunRilis}</p>
            <p>Rating: {item.rating}</p>

            <Link to={`/koleksi/${item.id}`}>
              Lihat Detail
            </Link>
          </article>
        ))}
    </main>
  )
}

function DetailFilm() {
  const { id } = useParams()
  const { film, loading, error, hapusFilm } = useFilm()
  const navigate = useNavigate()

  const item = film.find(
    (data) => data.id === Number(id)
  )

  function handleHapus() {
  hapusFilm(Number(id))
  navigate('/koleksi')
}

  if (loading) {
    return (
      <main>
        <p>Memuat detail film...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <p role="alert">{error}</p>
        <Link to="/koleksi">Kembali ke Koleksi</Link>
      </main>
    )
  }

  if (!item) {
    return (
      <main>
        <h1>Film tidak ditemukan</h1>
        <Link to="/koleksi">Kembali ke Koleksi</Link>
      </main>
    )
  }

  return (
    <main>
      <h1>{item.judul}</h1>
      <p>Kategori: {item.kategori}</p>
      <p>Sutradara: {item.sutradara}</p>
      <p>Tahun Rilis: {item.tahunRilis}</p>
      <p>Rating: {item.rating}</p>

      <button onClick={handleHapus}>
        Hapus Film
      </button>

      <p>
        <Link to="/koleksi">Kembali ke Koleksi</Link>
      </p>
    </main>
  )
}

function TidakDitemukan() {
  return (
    <main>
      <h1>404</h1>
      <p>Halaman tidak ditemukan.</p>
      <Link to="/">Kembali ke Beranda</Link>
    </main>
  )
}

function Panduan() {
  return (
    <main className="panduan-container">
      <h1>Panduan Penggunaan</h1>

      <section>
        <h2>1. Melihat Koleksi</h2>
        <p>
          Buka menu Koleksi untuk melihat daftar film
          dan serial yang tersedia.
        </p>

        <h2>2. Mencari Tontonan</h2>
        <p>
          Gunakan kolom pencarian untuk menemukan judul
          film atau serial.
        </p>

        <h2>3. Menambahkan Tontonan</h2>
        <p>
          Buka menu Tambah, isi informasi tontonan,
          kemudian tekan tombol Simpan.
        </p>

        <h2>4. Mengelola Koleksi</h2>
        <p>
          Buka detail tontonan untuk melihat informasi
          dan menghapus koleksi.
        </p>
      </section>

      <Link to="/koleksi">Lihat Koleksi</Link>
    </main>
  )
}


function Layout() {
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="site-logo">
            CineList
          </Link>

          <nav aria-label="Navigasi utama">
            <NavLink to="/" end>
              Beranda
            </NavLink>

            <NavLink to="/koleksi">
              Koleksi
            </NavLink>

            <NavLink to="/tambah">
              Tambah
            </NavLink>

            <NavLink to="/statistik">
              Statistik
            </NavLink>

            <NavLink to="/tentang">
              Tentang
            </NavLink>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/koleksi" element={<Koleksi />} />
        <Route path="/koleksi/:id" element={<DetailFilm />} />
        <Route path="/tambah" element={<TambahFilm />} />
        <Route path="/statistik" element={<Statistik />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="/panduan" element={<Panduan />} />
        <Route path="*" element={<TidakDitemukan />} />
      </Routes>

      <footer className="site-footer">
        <p>
          &copy; 2026 CineList - Daftar Tontonan Film dan Serial
        </p>
        <p>Najib Abhinaya | 124140124</p>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <FilmProvider>
      <Layout />
    </FilmProvider>
  )
}

function TambahFilm() {
  const { tambahFilm } = useFilm()
  const navigate = useNavigate()

  const [judul, setJudul] = useState('')
  const [kategori, setKategori] = useState('Film')
  const [sutradara, setSutradara] = useState('')
  const [tahunRilis, setTahunRilis] = useState('')
  const [rating, setRating] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!judul.trim()) {
      setError('Judul film atau serial wajib diisi.')
      return
    }

    tambahFilm({
      judul: judul.trim(),
      kategori,
      sutradara: sutradara.trim(),
      tahunRilis: Number(tahunRilis),
      rating: Number(rating),
    })

    navigate('/koleksi')
  }

  
  return (
    <main className="form-container">
      <h1>Tambah Film atau Serial</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="judul">Judul:</label>
          <input
            id="judul"
            type="text"
            value={judul}
            onChange={(event) => setJudul(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="kategori">Kategori:</label>
          <select
            id="kategori"
            value={kategori}
            onChange={(event) => setKategori(event.target.value)}
          >
            <option value="Film">Film</option>
            <option value="Serial">Serial</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sutradara">Sutradara:</label>
          <input
            id="sutradara"
            type="text"
            value={sutradara}
            onChange={(event) => setSutradara(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tahunRilis">Tahun Rilis:</label>
          <input
            id="tahunRilis"
            type="number"
            value={tahunRilis}
            onChange={(event) => setTahunRilis(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating:</label>
          <input
            id="rating"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button className="form-button" type="submit">
          Simpan
        </button>
      </form>

      <p>
        <Link className="form-back-link" to="/koleksi">
          Kembali ke Koleksi
        </Link>
      </p>
    </main>
  )
}



function Statistik() {
  const { film, loading, error } = useFilm()

  const jumlahFilm = film.filter(
    (item) => item.kategori === 'Film'
  ).length

  const jumlahSerial = film.filter(
    (item) => item.kategori === 'Serial'
  ).length

  const total = film.length
  const koleksiTerbaru = film.slice(-3).reverse()

  return (
    <main className="statistik-container">
      <h1>Statistik Koleksi</h1>

      <Link to="/koleksi" className="statistik-back-link">
        Kembali ke Koleksi
      </Link>

      {loading && <p>Memuat statistik...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <div className="statistik-layout">
          <section className="statistik-card">
            <h2>Ringkasan Koleksi</h2>

            <ul>
              <li>Film: {jumlahFilm}</li>
              <li>Serial: {jumlahSerial}</li>
              <li>Total koleksi: {total}</li>
            </ul>

            <h3>Tambahan Terbaru</h3>

            {koleksiTerbaru.length > 0 ? (
              <ul>
                {koleksiTerbaru.map((item) => (
                  <li key={item.id}>
                    {item.judul} - <em>{item.kategori}</em>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Belum ada koleksi.</p>
            )}
          </section>

          <section className="statistik-tabel">
            <table>
              <thead>
                <tr>
                  <th>Kategori</th>
                  <th>Jumlah</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Film</td>
                  <td>{jumlahFilm}</td>
                </tr>

                <tr>
                  <td>Serial</td>
                  <td>{jumlahSerial}</td>
                </tr>

                <tr>
                  <th>Total</th>
                  <th>{total}</th>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      )}
    </main>
  )
}


function Tentang() {
  return (
    <main className="tentang-container">
      <h1>Tentang Aplikasi</h1>

      <section className="tentang-card">
        <h2>Daftar Tontonan Film dan Serial</h2>

        <p>
          Aplikasi ini dibuat untuk membantu pengguna
          mencatat, mengelola, dan melihat daftar film
          serta serial yang ingin ditonton.
        </p>

        <h3>Identitas Mahasiswa</h3>

        <p>
          <strong>Nama:</strong> {mahasiswa.nama}
        </p>

        <p>
          <strong>NIM:</strong> {mahasiswa.nim}
        </p>
      </section>

      <Link to="/">Kembali ke Beranda</Link>
    </main>
  )
}
