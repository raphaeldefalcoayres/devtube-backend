export function parseISO8601Duration(duration: string) {
  const matches = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)

  if (!matches) {
    return 0
  }

  const hours = matches[1] ? parseInt(matches[1].replace('H', '')) : 0
  const minutes = matches[2] ? parseInt(matches[2].replace('M', '')) : 0
  const seconds = matches[3] ? parseInt(matches[3].replace('S', '')) : 0

  return hours * 60 + minutes + seconds / 60
}

export function isBrazilianChannel(channelName: string) {
  const brazilianChannels = [
    'Rocketseat',
    'Sujeito programador',
    'TekZoom',
    'Catapulta Club',
    'Rafaella Ballerini',
    'Prof. Rogério Napoleão Jr.',
    'Dev Junior Alves',
    'Victor Lima - Ciência da Computação',
    'Professor Edson Maia',
    'Mario Souto - Dev Soutinho',
    'Dev Cansado',
    'Compilado do Código Fonte TV [OFICIAL]',
    'Lucas Nhimi',
    'Carlos Ferreira - EspecializaTi',
    'Will Dev',
    'Pedro Dev',
    'dpw',
    'CFBCursos',
    'Mago Acadêmico',
    'Inteliogia',
    'Celke',
    'Adriano Viana',
    'Marcelo Rocha Designer',
    'Hebert Cisco',
    'Stack Mobile',
    'Matheus Battisti - Hora de Codar',
    'Orivaldo Santana',
    'Bruno Brito',
    'Cícero Martins - Fala, Dev',
    'Mind7Design',
    'DeveloperDeck101',
    'EuCurso',
    'conecta elas',
    'Vamos Testar?',
    'Professor José de Assis',
    'Código Todo Dia',
    'odo.digital - e-commerce',
    'Segredos Do Sistema',
    'Web Produtora',
    'Dicas de Sites',
    'Vem Codar Brasil',
    'Jemima Luz',
    'Jovem Programador',
    'JV',
    'Desenvolvendo do básico',
    'Tejas Development & Design',
  ]

  return brazilianChannels.includes(channelName)
}
