import {
  OfficeBuildingIcon,
  UserIcon,
  IdentificationIcon,
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
  ],
}
