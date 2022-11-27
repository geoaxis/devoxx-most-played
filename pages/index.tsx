import { google } from 'googleapis'
import { Collection, Card, View, Heading, Badge, Text, Image, Flex } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';


interface Standard {
  url: string
}
interface Thumbnails {
  standard: Standard
}
interface Snippet {
  title: string,
  videoId: string,
  description: string,
  publishedAt: string,
  thumbnails: Thumbnails,
}

interface Statistics {
  viewCount: string,
}
interface PlaylistElement {
  id: string,
  snippet: Snippet,
  statistics: Statistics,


}
interface DataJson {
  data: PlaylistElement[],
  lastUpdated: string,
}

function Home(param:DataJson  ) {
  console.log(param.lastUpdated);
  return (

    <>
      <Heading
        width='100vw'
        level={1}
      >
        Devoxx 2022 Most Played talks
      </Heading>
      <p>Last Updated : {param.lastUpdated}</p>
      <Collection
        items={param.data}
        type="grid"

        templateColumns="1fr 1fr"
        templateRows="35rem 35rem"


      >
        {(item, index) => (
          <Card
            key={index}
            borderRadius="medium"
            variation="outlined"
            textAlign="center"
          >
            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
              alignContent="center"
              wrap="nowrap"
              gap="1rem"
            >
              <View padding="xs">

                <Heading padding="medium">{item.snippet.title}</Heading>
                <Image
                  alt={item.id}
                  src={item.snippet.thumbnails.standard.url}
                  objectFit="initial"
                  objectPosition="50% 50%"
                  backgroundColor="initial"
                  height="60%"
                  width="60%"
                  opacity="100%"
                  onClick={() => window.open('https://youtu.be/' + item.id)}
                />

                <Text
                  variation="primary"
                  as="p"
                  color="blue"
                  lineHeight="1.5em"
                  fontWeight={400}
                  fontSize="1em"
                  fontStyle="normal"
                  textDecoration="none"
                  title={item.snippet.description}
                  textAlign="center"
                >
                  {item.snippet.description.length > 100 ? item.snippet.description.substring(0, 97) + "..." : item.snippet.description}
                </Text>
                <Badge size="large">{item.statistics.viewCount}</Badge>

              </View>
            </Flex>
          </Card>
        )
        }
      </Collection >
    </>

  )
}

export async function getStaticProps() {

  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.GOOGLE_API_KEY
  });

  let firstTime = true;
  let hasNextToken = false;
  let next = '';
  let data2 = new Map();

  while (firstTime || hasNextToken) {
    firstTime = false;

    const items = await youtube.playlistItems.list({
      "part": [
        "snippet,contentDetails"
      ],
      "maxResults": 50,
      "pageToken": next,
      "playlistId": process.env.PLAYLIST
    });


    if (items.data.nextPageToken != null &&
      (items.data.prevPageToken === undefined || items.data.nextPageToken != items.data.prevPageToken)) {
      hasNextToken = true;
      next = items.data.nextPageToken;
    } else {
      hasNextToken = false;

    }

    let ids = items.data.items?.reduce((a, c) => a.concat(String(c.contentDetails?.videoId)), new Array<string>())


    const result = await youtube.videos.list({
      "part": [
        "snippet,contentDetails,statistics,id"
      ],
      "id": ids
    });
    result.data.items?.forEach(element => {
      data2.set(element.id, element);
    });
  }

  const data = Array.from(data2.values()).sort((a, b) => Number(b.statistics?.viewCount) - Number(a.statistics?.viewCount))
 

  const lastUpdated = new Date().toLocaleString('sv-SE', {
    timeZone: 'Europe/Berlin',
  })

  // Pass data to the page via props
  return { props: { data, lastUpdated} }
}


export default Home

