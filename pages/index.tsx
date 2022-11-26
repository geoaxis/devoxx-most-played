import { google } from 'googleapis'
import { Collection, Card, View, Heading, Badge, Text } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';


interface Snippet {
  title: string,
  description: string,
  publishedAt: string,
}

interface Statistics {
  viewCount: string,
}
interface PlaylistElement {
  id: string
  snippet: Snippet,
  statistics: Statistics
}
interface DataJson {
  data: PlaylistElement[]
}

function Home({ data }: DataJson) {
  return (

    <Collection
      items={data}
      type="grid"

      templateColumns="1fr 1fr 1fr"
      templateRows="12rem 12rem 12rem"
      

    >
      {(item, index) => (
        <Card
          key={index}
          borderRadius="medium"
          maxWidth="50rem"
          variation="outlined"
        >

          <View padding="xs">
            <Heading padding="medium">{item.snippet.title}</Heading>
            <Badge size="small">{item.statistics.viewCount}</Badge>

            <Text
              variation="primary"
              as="p"
              color="blue"
              lineHeight="1.5em"
              fontWeight={400}
              fontSize="1em"
              fontStyle="normal"
              textDecoration="none"
              width="30vw"
              title={item.snippet.description}
            >
              {item.snippet.description.length > 100 ? item.snippet.description.substring(0,97) + "...":item.snippet.description}
            </Text>
          </View>
        </Card>
      )}
    </Collection>

  )
}

export async function getStaticProps() {

  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.GOOGLE_API_KEY
  });

  const items = await youtube.playlistItems.list({
    "part": [
      "snippet,contentDetails"
    ],
    "maxResults": 100,
    "playlistId": process.env.PLAYLIST
  });


  let ids = items.data.items?.reduce((a, c) => a.concat(c.contentDetails?.videoId), new Array())

  const result = await youtube.videos.list({
    "part": [
      "snippet,contentDetails,statistics"
    ],
    "id": ids
  });


  const data = result.data.items;

  result.data.items?.sort((a, b) => Number(b.statistics?.likeCount) - Number(a.statistics?.likeCount) )

  // Pass data to the page via props
  return { props: { data } }
}


export default Home

