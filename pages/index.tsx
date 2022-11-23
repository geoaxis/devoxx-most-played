import Head from 'next/head'
import styles from '../styles/Home.module.css'


interface ToDoElement {
    userId: number,
    id: number,
    title: string,
    completed: boolean
  }
interface DataJson {
    data: ToDoElement[]
}

function Home( {data} :DataJson) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Devoxx Most Played</title>
        <meta name="description" content="Most played videos for Devoxx Belgium 2022" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://nextjs.org">Devoxx</a> Most played
        </h1>

        <div className={styles.grid}>

        
        {
        data.map(todo => {
        return (

          <a key={todo.id}  href="https://nextjs.org/docs" className={styles.card}> 
          <h2 className={styles.card}>{todo.id}</h2>
          <p>{todo.title.length > 20 ? todo.title.substring(0, 17) + "..." : todo.title }</p>
          </a> 
        
        );
      })}

        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Footer
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps() {
    // Fetch data from external API
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/`)
    const data = await res.json()
  
    // Pass data to the page via props
    return { props: { data } }
  }

export default Home

