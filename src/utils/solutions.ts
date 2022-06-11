import {
  OfficeBuildingIcon,
  UserIcon,
  IdentificationIcon,
  ShoppingBagIcon,
  TagIcon,
  ShoppingCartIcon,
} from '@heroicons/react/outline'

export const solutions = {
  LIST: [
    {
      name: 'Cidades',
      description: 'Confira as cidades já cadastradas',
      href: '/list/cities',
      icon: OfficeBuildingIcon,
    },
    {
      name: 'Produtos',
      description: 'Confira os seus produtos',
      href: '/list/products',
      icon: TagIcon,
    },
    {
      name: 'Clientes',
      description: 'Confira os seus clientes',
      href: '/list/clients',
      icon: UserIcon,
    },
    {
      name: 'Fornecedores',
      description: 'Confira os seus fornecedores',
      href: '/list/suppliers',
      icon: IdentificationIcon,
    },
    {
      name: 'Ordens de compra',
      description: 'Confira as suas ordens de compra a fornecedores',
      href: '/list/purchase-orders',
      icon: ShoppingCartIcon,
    },
    {
      name: 'Ordens de venda',
      description: 'Confira as suas ordens de venda a clientes',
      href: '/list/sale-orders',
      icon: ShoppingBagIcon,
    },
  ],
  REGISTER: [
    {
      name: 'Cidade',
      description: 'Cadastre uma nova cidade',
      href: '/register/city',
      icon: OfficeBuildingIcon,
    },
    {
      name: 'Produto',
      description: 'Cadastre um  novo produto',
      href: '/register/product',
      icon: TagIcon,
    },
    {
      name: 'Cliente',
      description: 'Cadastre um  novo cliente',
      href: '/register/client',
      icon: UserIcon,
    },
    {
      name: 'Fornecedor',
      description: 'Cadastre um  novo fornecedor',
      href: '/register/supplier',
      icon: IdentificationIcon,
    },
    {
      name: 'Ordem de compra',
      description: 'Cadastre uma nova ordem de compra',
      href: '/register/purchase-order',
      icon: ShoppingCartIcon,
    },
    {
      name: 'Ordem de venda',
      description: 'Cadastre uma nova ordem de venda',
      href: '/register/sale-order',
      icon: ShoppingBagIcon,
    },
  ],
}
