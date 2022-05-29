import {
  OfficeBuildingIcon,
  UserIcon,
  IdentificationIcon,
  ShoppingBagIcon,
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
      name: 'Produtos',
      description: 'Confira os seus produtos',
      href: '/list/products',
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
      name: 'Produto',
      description: 'Cadastre um  novo produto',
      href: '/register/product',
      icon: ShoppingBagIcon,
    },
  ],
}
