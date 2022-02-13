import {useRouter} from 'next/router'

const article = ({article}) => {
  const router = useRouter();
  const {id} = router.query;

  return <div>
    <p>This is article {id}</p>
    <p>{JSON.stringify(article)}</p>
  </div>
}

export const getStaticProps = async (context) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${context.params.id}`)
  const article = await res.json()
  return {
    props: {
      article
    }
  }
};

export const getStaticPaths = async () => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts`)
  const articles = await res.json()
  const ids = articles.map(a =>  a.id)
  return {
    paths: ids.map(i => ({params: {id: i.toString()}})),
    fallback: false
  }
}

export default article;