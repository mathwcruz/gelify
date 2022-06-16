import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { parseCookies } from 'nookies'

import { Header } from '../components/Header'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Gelify</title>
      </Head>
      <Header />
      <div className="flex h-full w-screen flex-col items-center justify-center gap-10 py-44 ">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-center text-xl font-semibold text-black dark:text-white lg:text-5xl">
            Gelify
          </h1>
          <p className="text-center text-sm font-normal text-gray-600 dark:text-gray-200 md:max-w-sm md:text-base">
            Faça toda a inclusão dos seus clientes, fornecedores, produtos e
            transações de compra e venda dos mesmos
          </p>
        </div>
        <img
          className="h-32 md:h-40 lg:h-72"
          src="/mechanical-workshop-banner.png"
          alt="Um homem de cabelo preto curto, camiseta e calça verde, sapatos pretos empurrando um carinho de quadro rodas contendo várias caixas que estão empilhadas uma encima da outra. No fundo, há mais caixas empilhadas"
        />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx)

  if (!cookies['user']) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default Home
