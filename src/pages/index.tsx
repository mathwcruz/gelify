import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Oficina Mecânica</title>
      </Head>
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-center text-xl font-semibold text-black lg:text-5xl">
            Oficina Mecânica
          </h1>
          <p className="md: max-w-smmax-w-sm text-center text-sm font-normal text-gray-400 md:text-base">
            Faça toda a inclusão dos seus clientes, serviços e transações em um
            só lugar
          </p>
        </div>
        <img
          className="h-32 md:h-40 lg:h-72"
          src="/mechanical-workshop-banner.png"
          alt=""
        />
      </div>
    </>
  )
}

export default Home
