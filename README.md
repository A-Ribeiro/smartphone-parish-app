# Release Notes #

## Release v1.0 ##

* Google Drive setup script
* Builtin content pack script
* Online content pack and upload script
* Android Studio application project
* News editor
* Group editor
* Parish information editor
* Pray editor
* Included Plugin: online-guia-digital (digital guide)
* Included Plugin: online-repertorios (music script)

# Smartphone Application for Catholic Parish: EN #

## Description ##

This Package has algorithms and libraries needed to create and publish online smartphone application with features to aid the information delivery related to Catholic Parish.

Site(Pt-BR): https://sites.google.com/site/smartphoneparishapp/

## APLICATIVO SMARTPHONE PARA PARÓQUIAS ##

Crie um aplicativo smartphone android para a sua paróquia (0800) com: notícias; informações sobre os grupos que atuam na mesma; informações sobre a própria paróquia; pedidos de oraçãp; documentos digitais(novenas e devocionários); repertórios e cifras. Converse com o seu pároco e depois assista aos vídeos, que explicam com mais detalhes o que fazer.

### História ###

A idéia desse aplicativo surgiu de observações que fiz ao frequentar uma paróquia aqui perto de casa.

A primeira foi em relação a quantidade de papeis que circulam dentro da igreja para divulgação, acompanhamento de missa e etc.

Quando eu estava procurando informações dos grupos que atuam na paróquia, percebi também que era trabalhoso saber a quantidade de grupos e também quando ocorrem as reuniões.

Com essas observações em mente, eu pensei: por que não fazer um aplicativo para ter toda essa informação?

Então foi o que fiz.

### O Aplicativo ###

Ao invés de dar o aplicativo pronto, foi criado um conjunto de ferramentas que permitem a qualquer pessoa criar o seu próprio aplicativo android.

As ferramentas auxiliam desde a criação do ícone do aplicativo até a atualização de conteúdo depois que ele já está publicado na loja.

Para facilitar esse processo de criação e configuração do aplicativo, foi criado um conjunto de vídeos que explicam passo a passo a arquitetura proposta, quais ferramentas utilizar, e quais páginas devem ser configuradas.

O aplicativo possui quatro partes:

* __Notícias: __que contém uma listagem de notícias que podem ser postadas e atualizadas rapidamente usando a ferramenta própria.
* __Atividades da comunidade: __que contém a listagem de grupos da paróquia, onde podem ser colocadas informações da história do grupo, qual o horário de encontro e também pode ser colocado o convite.
* __A paróquia: __que contém informações do pároco, forania e informações que geralmente são fixas, como exemplo: horário de missa, horário de confissão, contatos, procedimentos de batismo, casamentos, etc...
* __Pedidos de oração: __que contém informação de como uma pessoa pode pedir oração naquela paróquia.

### Funcionamento com e sem internet ###

Esse aplicativo foi pensado para funcionar também com ou sem internet.

Quando a internet está disponível, ele atualiza as informações internas.

Quando o smartphone estiver em uma região sem internet, ele permite acessar todas as informações que já vieram das atualizações passadas.

Para maiores detalhes, veja o vídeo que fala sobre a arquitetura do aplicativo.

Porque Android?

No inicio eu pensei em criar um aplicativo android, por causa do funcionamento da loja android. Nela você paga uma vez a taxa de inscrição, e depois disso, pode publicar quantos aplicativos quiser na google play.

Essa versão do aplicativo não tem suporte ao iPhone e iPad, porque a loja da Apple pede uma inscrição de aproximadamente 200 dolares anuais para que você possa desenvolver e publicar aplicativos. Não foi desenvolvido para essa plataforma por questões financeiras.

### Plugins ###

A arquitetura do aplicativo foi pensada para funcionar também baseada em plugins.

Plugins são formas de estender a funcionalidade do aplicativo sem precisar criar um aplicativo novo.

__Exemplo: __Imagina que o aplicativo já tem a funcionalidade de mostrar as notícias cadastradas. Agora é necessário adicionar uma nova informação com a <b><i>liturgia diária</i></b>. Para isso, ou se criaria um aplicativo novo, ou utilizando o mesmo aplicativo, através de um __plugin__, se acrescentaria a funcionalidade de leitura da __liturgia diária__.

### Plugins que já estão presentes nessa versão  ###

Essa versão do aplicativo já vem com dois plugins que podem ser utilizados em conjunto com o aplicativo.

O primeiro é o plugin de __guia digital__. Esse plugin permite a criação de documentos em formato de novenas, ou documentos baseados em etapas ou dias. E possível distribuir esses documentos para os celulares das pessoas por esse plugin. Pode ser útil para divulgar novenas, devocionários, guias de orações, etc...

O segundo é o plugin de __repertórios__. Esse plugin permite a criação de repertórios de músicas com ou sem cifra. Quando um repertório é instalado no aplicativo, a pessoa pode acessar qualquer música, ou imprimir um caderno em formato PDF desse repertório. Pode ser útil tanto para músicos, para cantores e também para pessoas acompanharem uma sequência de músicas durante a missa.

### Vídeos ###

Os vídeos abaixo foram criados, para explicar passo a passo como utilizar as ferramentas, desde baixar o projeto, configurar ícones, criar aplicativo para a loja, até a instalação e configuração de plugins.

Lista de vídeos:

* [Passo1: Baixando Projeto do GitHub](https://www.youtube.com/watch?v=UUGD_SbGjyk)
* [Apresentação Arquitetura e Softwares](https://www.youtube.com/watch?v=dyWYwTL6vzA)
* [Passo2: Publicar Aplicativo](https://www.youtube.com/watch?v=ynvnRtJN-sg)
* [Passo3: Editor de Noticias](https://www.youtube.com/watch?v=jZEcCWmhN0c)
* [Passo4: Editor de Grupos](https://www.youtube.com/watch?v=HcCmkzr6Utg)
* [Passo5: Editor de Informações da Paróquia](https://www.youtube.com/watch?v=tPjJglzY8dU)
* [Passo6: Editor de Pedidos de Oração](https://www.youtube.com/watch?v=AeJoLf-WFjs)
* [Passo7: Trocando Cores do Aplicativo](https://www.youtube.com/watch?v=3-m6wBR8OeE)
* [Plugins](https://www.youtube.com/watch?v=-OdgHzSNvX0)
* [PLUGIN: Guia Digital](https://www.youtube.com/watch?v=D9x8yRH0loM)
* [PLUGIN: Repertórios](https://www.youtube.com/watch?v=sI1sC48iKEA)


### App Screen ###

![alt tag](https://github.com/A-Ribeiro/smartphone-parish-app/raw/master/website/img/a1.jpg)
![alt tag](https://github.com/A-Ribeiro/smartphone-parish-app/raw/master/website/img/b1.jpg)
![alt tag](https://github.com/A-Ribeiro/smartphone-parish-app/raw/master/website/img/a3a.jpg)
![alt tag](https://github.com/A-Ribeiro/smartphone-parish-app/raw/master/website/img/_a3.jpg)


## Software List ##

### Development Environment

1. [Android Studio](https://developer.android.com/studio/)
1. [Chrome](https://www.google.com.br/chrome/browser/desktop/)
1. [Notepad++](https://notepad-plus-plus.org/)

### Image Editors

1. [Gimp](https://www.gimp.org/)
1. [Krita](https://krita.org/)
1. [MyPaint](http://mypaint.org/)
1. [InkScape](https://inkscape.org/)

### File Transfer Software (FTP)

1. [FileZilla](https://filezilla-project.org/)

### Local HTTP Server

1. [XAMPP](https://www.apachefriends.org/pt_br/index.html)

### 3rd Party Services That Needs Account Configuration

1. [Google Play Developer](https://play.google.com/apps/publish/)
1. [000Webhost](https://www.000webhost.com/)

