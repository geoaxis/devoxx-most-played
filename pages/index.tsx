import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'


interface ITodoJson {
    userId: number,
    id: number,
    title: string,
    completed: boolean
  }
//@ts-ignore
function Home( {data}) {
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
        //@ts-ignore
        data.map(todo => {
        return (

          <a href="https://nextjs.org/docs" className={styles.card}> 
          <h2 className={styles.card}>{todo.id}</h2>
          <p>{todo.title}</p>
          </a> 
        
        );
      })}

            
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

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

