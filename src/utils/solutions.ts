import { OfficeBuildingIcon, UserIcon } from '@heroicons/react/outline'

export const solutions = {
  LIST: [
    {
      name: 'Cidades',
      description: 'Confira as cidades já cadastradas',
      href: '/list/cities',
      icon: OfficeBuildingIcon,
    },
    {
      name: 'Pessoas',
      description: 'Confira as pessoas já cadastradas',
      href: '/list/people',
      icon: UserIcon,
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
      name: 'Pessoa',
      description: 'Cadastre uma nova pessoa',
      href: '/register/person',
      icon: UserIcon,
    },
  ],
}
