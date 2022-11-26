import { google } from 'googleapis'
import { Collection, Card, View, Heading, Badge, Text, Image } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';


interface Standard {
  url: string
}
interface Thumbnails {
  standard: Standard
}
interface Snippet {
  title: string,
  description: string,
  publishedAt: string,
  thumbnails: Thumbnails
}

interface Statistics {
  viewCount: string,
}
interface PlaylistElement {
  id: string
  snippet: Snippet,
  statistics: Statistics,


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
      templateRows="30rem 30rem 30rem"


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
            <Image
              alt="Amplify logo"
              src={item.snippet.thumbnails.standard.url}
              objectFit="initial"
              objectPosition="50% 50%"
              backgroundColor="initial"
              height="75%"
              width="75%"
              opacity="100%"
              onClick={() => alert('📸 Say cheese!')}
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
              width="30vw"
              title={item.snippet.description}
            >
              {item.snippet.description.length > 100 ? item.snippet.description.substring(0, 97) + "..." : item.snippet.description}
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

  let firstTime = true;
  let hasNextToken = false;
  let next = '';
  let gloablResult = new Array();

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
      console.log(items.data.nextPageToken + " ," + items.data.prevPageToken + ":" + next);
    } else {
      hasNextToken = false;
      console.log(items.data.nextPageToken + "-" + items.data.prevPageToken);
      break;

    }

    let ids = items.data.items?.reduce((a, c) => a.concat(String(c.contentDetails?.videoId)), new Array<string>())
    console.log(ids);

    const result = await youtube.videos.list({
      "part": [
        "snippet,contentDetails,statistics"
      ],
      "id": ids
    });
    gloablResult.push(result.data.items);

  }

  let data = [].concat.apply([], gloablResult);

  //@ts-ignore
  data?.sort((a, b) => Number(b.statistics?.likeCount) - Number(a.statistics?.likeCount))

  // Pass data to the page via props
  return { props: { data } }
}


export default Home

