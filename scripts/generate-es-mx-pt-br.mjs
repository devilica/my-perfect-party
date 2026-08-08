import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'locales');

function flatten(obj, prefix = '') {
  const entries = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      entries.push(...flatten(v, key));
    } else {
      entries.push([key, v]);
    }
  }
  return entries;
}

function unflatten(entries) {
  const result = {};
  for (const [keyPath, value] of entries) {
    const parts = keyPath.split('.');
    let cur = result;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] ??= {};
      cur = cur[parts[i]];
    }
    cur[parts.at(-1)] = value;
  }
  return result;
}

function rebuildFromTemplate(template, values) {
  const map = new Map(values);
  const entries = flatten(template).map(([key]) => [key, map.get(key)]);
  return unflatten(entries);
}

function applyReplacements(text, replacements) {
  let out = text;
  for (const [from, to] of replacements) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(escaped, 'g'), to);
  }
  return out;
}

const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8'));
const es = JSON.parse(fs.readFileSync(path.join(localesDir, 'es.json'), 'utf8'));
const pt = JSON.parse(fs.readFileSync(path.join(localesDir, 'pt.json'), 'utf8'));

const esMxGlobalReplacements = [
  ['Añadir', 'Agregar'],
  ['añadir', 'agregar'],
  ['Añade', 'Agrega'],
  ['añade', 'agrega'],
  ['Ajustes', 'Configuración'],
  ['ajustes', 'configuración'],
  ['Importe', 'Monto'],
  ['importe', 'monto'],
  ['Introduce', 'Ingresa'],
  ['introduce', 'ingresa'],
  ['Introduzca', 'Ingresa'],
  ['introduzca', 'ingresa'],
  ['cuenta atrás', 'cuenta regresiva'],
  ['Cuenta atrás', 'Cuenta regresiva'],
  ['dispositivos móviles', 'celulares'],
  ['en móviles', 'en celulares'],
  ['tu teléfono', 'tu celular'],
  ['Tu teléfono', 'Tu celular'],
  ['el teléfono', 'el celular'],
  ['Tarta', 'Pastel'],
  ['tarta', 'pastel'],
  ['papelera', 'bote de basura'],
  ['Papelera', 'Bote de basura'],
  ['Mi fiesta perfecta', 'Mi fiesta perfecta'],
  ['My Perfect Party', 'Mi fiesta perfecta'],
  ['¿Seguro que quieres', '¿Seguro que quieres'],
  ['Confirme su asistencia', 'Confirma tu asistencia'],
  ['Confirme su presencia', 'Confirma tu asistencia'],
  ['Le invitamos', 'Te invitamos'],
  ['le invitamos', 'te invitamos'],
  ['respeta su privacidad', 'respeta tu privacidad'],
  ['su información', 'tu información'],
  ['Sus datos', 'Tus datos'],
  ['sus datos', 'tus datos'],
  ['su dispositivo', 'tu dispositivo'],
  ['Su dispositivo', 'Tu dispositivo'],
  ['utiliza nuestra', 'usas nuestra'],
  ['utilice nuestra', 'uses nuestra'],
  ['Si tiene preguntas', 'Si tienes preguntas'],
  ['contáctenos', 'contáctanos'],
  ['Contáctenos', 'Contáctanos'],
  ['Si cree que', 'Si crees que'],
  ['Si no está de acuerdo', 'Si no estás de acuerdo'],
  ['no utilice', 'no uses'],
  ['Usted es', 'Eres'],
  ['usted es', 'eres'],
  ['Si activa', 'Si activas'],
  ['Opcionalmente puede', 'Opcionalmente puedes'],
  ['puede enviar', 'puedes enviar'],
  ['Usted es responsable', 'Eres responsable'],
  ['usted es responsable', 'eres responsable'],
  ['Para preguntas', 'Para preguntas'],
  ['Al descargar, instalar o utilizar', 'Al descargar, instalar o usar'],
  ['acepta estos', 'aceptas estos'],
  ['Le ayuda', 'Te ayuda'],
  ['le ayuda', 'te ayuda'],
  ['puede añadir', 'puedes agregar'],
  ['Puede añadir', 'Puedes agregar'],
  ['Toca Guardar', 'Toca Guardar'],
  ['Eres responsable de mantener', 'Eres responsable de mantener'],
];

const esMxOverrides = {
  'app.name': 'Mi fiesta perfecta',
  'app.tagline': 'Celebra sin estrés',
  'common.add': 'Agregar',
  'settings.title': 'Configuración',
  'settings.appThemeHint': 'Colores para la pantalla de inicio y la configuración.',
  'settings.aboutText':
    'Mi fiesta perfecta — planea tu fiesta localmente en tu dispositivo. Todos los datos permanecen en tu dispositivo, con respaldo por correo opcional.',
  'settings.dataStorage': 'Los datos se guardan localmente en tu dispositivo.',
  'settings.backupTitle': 'Respaldo por correo',
  'settings.backupDescription':
    'Envía un respaldo de tus datos a tu correo como archivo JSON adjunto. Después de reinstalar la app, descarga el adjunto de tu correo e impórtalo aquí.',
  'settings.backupEmail': 'Correo de respaldo',
  'settings.backupImport': 'Importar respaldo',
  'settings.backupSyncing': 'Preparando respaldo...',
  'settings.backupSyncSuccess': 'El respaldo se preparó y envió.',
  'settings.backupSyncCancelled': 'El envío del respaldo se canceló.',
  'settings.backupSyncFailed': 'Error en el respaldo. Inténtalo de nuevo.',
  'settings.backupImportConfirmTitle': '¿Importar respaldo?',
  'settings.backupImportConfirmMessage':
    'Esto reemplazará todos los datos existentes de la app con los del archivo de respaldo.',
  'settings.backupImportSuccess': 'Respaldo importado correctamente.',
  'settings.backupImportFailed': 'Error al importar el respaldo.',
  'settings.backupInvalidFile': 'El archivo seleccionado no es un respaldo válido.',
  'settings.backupMailUnavailable':
    'La app de correo no está disponible. El respaldo se compartió mediante el menú de compartir del sistema.',
  'settings.notificationsHint':
    'Recordatorios locales 7 días, 24 horas y 1 hora antes de cada evento, usando la hora de tu celular.',
  'settings.notificationsInfoMessage':
    'Notificaciones locales en tu dispositivo.\n\nEventos: 7 días, 24 horas y 1 hora antes del inicio (usando la hora de tu celular).\n\nTareas: 24 horas antes y a la hora programada (mediodía si no hay hora).',
  'settings.usageGuide': 'Cómo usar la app',
  'guests.phone': 'Celular',
  'guests.emptySubtitle': 'Agrega invitados y lleva el control de quién confirmó asistencia.',
  'guests.status.confirmed': 'Confirmado',
  'invitation.rsvpPlaceholder': 'Confirma tu asistencia antes de...',
  'invitation.defaults.rsvp': 'Confirma tu asistencia, por favor.',
  'invitation.shareUnavailableWeb': 'Compartir está disponible en celulares.',
  'invitation.downloadUnavailableWeb': 'Descargar a la galería está disponible en celulares.',
  'events.deleteConfirm':
    '¿Seguro que quieres eliminar este evento? Se eliminarán todos los invitados, mesas, gastos y tareas. En línea, deberás ver un anuncio breve para eliminar.',
  'overview.countdownPastHint':
    'Elimina el evento (icono de bote de basura arriba) para liberar espacio en tu dispositivo.',
  'overview.countdownNoDate': 'Agrega la fecha y hora del evento para ver la cuenta regresiva.',
  'seating.hallOverviewHint':
    'Usa +/− para hacer zoom. Arrastra el salón para mover la vista. Arrastra una mesa para reposicionarla.',
  'obligations.presets.birthday.cake': 'Pastel',
  'tabs.seating': 'Mesas',
  'ads.sponsored': 'Anuncio',
  'ads.testHeadline': 'Anuncio de prueba',
  'ads.bannerTestSubtitle': 'Vista previa de banner de muestra para Expo Go.',
  'ads.testBody': 'Vista previa de anuncio nativo de muestra para Expo Go.',
  'ads.testCta': 'Instalar',
  'ads.rewardedTitle': 'Anuncio recompensado de prueba',
  'ads.rewardedPreviewNote': 'Vista previa de Expo — los anuncios reales aparecen en compilaciones APK.',
  'ads.rewardedPlaying': 'Reproduciendo anuncio…',
  'ads.rewardedClose': 'Cerrar',
  'notifications.event1DayTitle': 'Mañana es el gran día',
  'notifications.event1DayBody': '{{eventName}} es mañana',
  'notifications.eventTodayTitle': 'Hoy es la celebración',
  'notifications.eventTodayBody': '¡{{eventName}} es hoy!',
  'legal.privacy.title': 'Política de privacidad – Mi fiesta perfecta',
  'legal.privacy.intro':
    'Mi fiesta perfecta respeta tu privacidad. Esta Política de privacidad explica cómo se maneja tu información cuando usas nuestra aplicación.',
  'legal.privacy.localDataBody':
    'Mi fiesta perfecta no requiere una cuenta. Tus datos de eventos — incluidos invitados, planos de mesas, gastos, tareas y notas — se guardan localmente en tu dispositivo. No operamos servidores que recopilen o almacenen tus datos personales de planificación, y el desarrollador no tiene acceso a tu contenido.',
  'legal.privacy.childrenBody':
    'Mi fiesta perfecta no está destinada a recopilar información personal de menores de 13 años. Si crees que un menor proporcionó información a través de la aplicación, contáctanos.',
  'legal.privacy.contactBody':
    'Si tienes preguntas sobre esta Política de privacidad, contáctanos en {{email}}.',
  'legal.terms.title': 'Términos de uso – Mi fiesta perfecta',
  'legal.terms.intro': 'Estos Términos de uso rigen el uso de la aplicación Mi fiesta perfecta.',
  'legal.terms.acceptanceBody':
    'Al descargar, instalar o usar Mi fiesta perfecta, aceptas estos Términos de uso. Si no estás de acuerdo, no uses la aplicación.',
  'legal.terms.serviceBody':
    'Mi fiesta perfecta es una aplicación de planificación de fiestas con almacenamiento local. Te ayuda a gestionar eventos, listas de invitados, disposición de mesas, gastos, tareas y detalles de planificación relacionados. Las funciones principales funcionan sin conexión y los datos se guardan en tu dispositivo.',
  'legal.terms.accountBody':
    'La aplicación no requiere crear una cuenta ni iniciar sesión. Eres responsable de la información que ingresas y de mantener tu dispositivo seguro.',
  'legal.terms.userContentBody':
    'Eres el único responsable de la exactitud y legalidad de los nombres de invitados, datos de contacto, notas y otro contenido que agregues. No ingreses información que no tengas permiso para guardar o compartir.',
  'legal.terms.backupTitle': 'Respaldo y exportación',
  'legal.terms.backupBody':
    'Opcionalmente puedes enviar un respaldo de tus datos a tu dirección de correo electrónico. Eres responsable de proteger los archivos de respaldo y de restaurar los datos cuando sea necesario. No somos responsables de respaldos perdidos, dañados o inaccesibles.',
  'legal.terms.notificationsBody':
    'Si activas recordatorios, la aplicación programa notificaciones locales en tu dispositivo para tareas y eventos próximos. La entrega de notificaciones depende de la configuración y permisos de tu dispositivo.',
  'legal.privacy.adsBody':
    'La aplicación muestra anuncios a través de Google AdMob. AdMob puede recopilar información del dispositivo, identificadores publicitarios, dirección IP y datos sobre tus interacciones con los anuncios para mostrar y medir la publicidad. Google procesa estos datos de acuerdo con sus políticas.',
  'legal.terms.userContentTitle': 'Tu contenido',
  'legal.terms.adsBody':
    'La versión gratuita de la aplicación puede mostrar anuncios a través de Google AdMob. Los anuncios pueden aparecer al usar ciertas funciones. Google puede recopilar y procesar datos relacionados con la entrega de anuncios según lo descrito en sus políticas.',
  'legal.terms.availabilityBody':
    'Podemos actualizar la aplicación, estos Términos o discontinuar funciones en cualquier momento. El uso continuado tras los cambios significa que aceptas los Términos actualizados. También podemos actualizar la Política de privacidad periódicamente.',
  'legal.terms.contactBody': 'Para preguntas sobre estos Términos, contáctanos en {{email}}.',
  'legal.ads.title': 'Anuncios en Mi fiesta perfecta',
  'legal.ads.intro':
    'La versión gratuita de Mi fiesta perfecta se financia con anuncios. Esta página explica dónde aparecen los anuncios y cuándo se te puede pedir ver un anuncio recompensado breve.',
  'legal.usage.title': 'Cómo usar Mi fiesta perfecta',
  'legal.usage.intro':
    'Mi fiesta perfecta te ayuda a planear una celebración paso a paso. Esta guía explica cada pantalla y botón para que sepas exactamente qué hace cada acción.',
  'legal.usage.homeBody':
    'Aquí ves todos tus eventos. El icono de engranaje (arriba a la derecha) abre Configuración. El botón azul + (abajo a la derecha) crea un evento nuevo. Toca una tarjeta de evento para abrirla. El icono de lápiz en una tarjeta edita el nombre, fecha, ubicación y tema de ese evento.',
  'legal.usage.eventsBody':
    'Ingresa el nombre del evento, fecha y hora, ubicación y tema de la celebración. Puedes agregar categorías de invitados personalizadas (p. ej. Familia) y lados (p. ej. Novia, Novio). Toca Guardar para guardar los cambios. Cada evento mantiene su propia lista de invitados, mesas, gastos y tareas.',
  'legal.usage.eventHeaderBody':
    'Lápiz — editar el evento. Icono de descarga — exporta un informe PDF completo (invitados, mesas, gastos, tareas) a tu dispositivo. Bote de basura — elimina todo el evento (requiere confirmación; en línea puede mostrar un anuncio breve). En la pestaña Mesas, Ver salón muestra un plano visual.',
  'legal.usage.overviewBody':
    'Cuenta regresiva hasta el evento, gráfico de asistencia de invitados y estadísticas de mesas y gastos. Crear invitación abre el editor de invitaciones. Acciones rápidas abajo: Agregar invitado, Gestionar mesas, Agregar gasto.',
  'legal.usage.guestsBody':
    'Buscar por nombre. Filtros: Todos, Confirmados, Rechazados, Invitación enviada, Por invitar. Ordenar por nombre o fecha de alta. Toca una tarjeta de invitado para editar detalles. Toca la insignia de estado en una tarjeta para cambiar rápidamente la asistencia (llamada → invitación enviada → confirmado → rechazado). El icono de bote de basura elimina al invitado. + agrega un invitado nuevo.',
  'legal.usage.guestFormBody':
    'Campos: nombre, apellidos, tamaño del grupo (número de personas), celular, categoría, lado y notas. Establece la asistencia aquí o más tarde en la lista. Mesa — asigna una mesa o déjala sin asignar. Guardar guarda los cambios. Tras cada 30 personas en total (en línea), puede aparecer un anuncio breve antes de agregar más.',
  'legal.usage.tablesBody':
    '+ abre un menú: Agregar mesa (individual — nombre, capacidad, forma) o Creación masiva (muchas mesas a la vez con plantillas). En cada tarjeta de mesa: ojo — vista previa y asignar invitados, lápiz — editar, bote de basura — eliminar. Cada 10 mesas (en línea) puede requerir un anuncio breve.',
  'legal.usage.expensesBody':
    'Monto total y tu parte arriba. Gráficos por categoría abajo. Toca un gasto para editar; el bote de basura lo elimina. + agrega un gasto nuevo (nombre, monto, categoría, quién paga).',
  'legal.usage.obligationsBody':
    'Lista de cosas que organizar antes de la celebración (p. ej. fotógrafo, pastel). Agregar plantillas inserta elementos típicos para tu tema. Toca una tarjeta para editar título, estado, fecha, contacto y notas. + agrega una tarea en blanco.',
  'legal.usage.settingsTitle': 'Configuración',
  'legal.usage.settingsBody':
    'Idioma de la app, tema de la app (puede mostrar un anuncio breve al cambiar), notificaciones con icono info sobre intervalos de recordatorio, correo de respaldo, Enviar respaldo / Importar respaldo, valorar en Play Store, Política de privacidad, Términos de uso, Anuncios en la app y esta guía.',
  'legal.usage.backupTitle': 'Respaldo y restauración',
  'legal.usage.backupBody':
    'Todos los datos permanecen solo en tu dispositivo. Enviar respaldo crea un archivo JSON y abre el correo o el diálogo de compartir. Importar respaldo restaura datos de un archivo guardado previamente. Eres responsable de mantener tu respaldo seguro.',
};

const ptBrGlobalReplacements = [
  ['A minha festa perfeita', 'Minha festa perfeita'],
  ['a minha festa perfeita', 'minha festa perfeita'],
  ['My Perfect Party', 'Minha festa perfeita'],
  ['Definições', 'Configurações'],
  ['definições', 'configurações'],
  ['Partilhar', 'Compartilhar'],
  ['partilhar', 'compartilhar'],
  ['Partilhado', 'Compartilhado'],
  ['partilhado', 'compartilhado'],
  ['Partilhada', 'Compartilhada'],
  ['partilhada', 'compartilhada'],
  ['Transferir', 'Baixar'],
  ['transferir', 'baixar'],
  ['Transferência', 'Download'],
  ['transferência', 'download'],
  ['Ecrã', 'Tela'],
  ['ecrã', 'tela'],
  ['Separador', 'Aba'],
  ['separador', 'aba'],
  ['separadores', 'abas'],
  ['Ficheiro', 'Arquivo'],
  ['ficheiro', 'arquivo'],
  ['Ficheiros', 'Arquivos'],
  ['ficheiros', 'arquivos'],
  ['Eliminar', 'Excluir'],
  ['eliminar', 'excluir'],
  ['Elimine', 'Exclua'],
  ['elimine', 'exclua'],
  ['Montante', 'Valor'],
  ['montante', 'valor'],
  ['Nome próprio', 'Nome'],
  ['nome próprio', 'nome'],
  ['Telemóvel', 'Celular'],
  ['telemóvel', 'celular'],
  ['Plano de lugares', 'Plano de mesas'],
  ['plano de lugares', 'plano de mesas'],
  ['Gerir lugares', 'Gerenciar mesas'],
  ['gerir lugares', 'gerenciar mesas'],
  ['Conservatória', 'Cartório'],
  ['conservatória', 'cartório'],
  ['Gostas da app', 'Gosta do app'],
  ['gostas da app', 'gosta do app'],
  ['Ajuda-o', 'Ajuda você'],
  ['ajuda-o', 'ajuda você'],
  ['Convidamo-lo', 'Você está convidado'],
  ['É cordialmente convidado', 'Você está cordialmente convidado'],
  ['Juntamente com as suas famílias', 'Juntamente com suas famílias'],
  ['juntamente com as suas famílias', 'juntamente com suas famílias'],
  ['A sua parte', 'Sua parte'],
  ['a sua parte', 'sua parte'],
  ['Os seus', 'Seus'],
  ['os seus', 'seus'],
  ['O seu', 'Seu'],
  ['o seu', 'seu'],
  ['A sua', 'Sua'],
  ['a sua', 'sua'],
  ['Tem a certeza', 'Tem certeza'],
  ['tem a certeza', 'tem certeza'],
  ['Introduza', 'Digite'],
  ['introduza', 'digite'],
  ['Cópia de segurança', 'Backup'],
  ['cópia de segurança', 'backup'],
  ['Acerca de', 'Sobre'],
  ['acerca de', 'sobre'],
  ['Lixo', 'Lixeira'],
  ['lixo', 'lixeira'],
  ['programador', 'desenvolvedor'],
  ['Programador', 'Desenvolvedor'],
  ['Termos de utilização', 'Termos de uso'],
  ['termos de utilização', 'termos de uso'],
  ['aplicação', 'app'],
  ['Aplicação', 'App'],
];

const ptBrOverrides = {
  'app.name': 'Minha festa perfeita',
  'app.tagline': 'Celebre sem estresse',
  'onboarding.selectLanguage': 'Escolha seu idioma',
  'events.myEvents': 'Meus eventos',
  'events.deleteConfirm':
    'Tem certeza de que deseja excluir este evento? Todos os convidados, mesas, despesas e tarefas serão removidos. Online, você precisará assistir a um anúncio curto para excluir.',
  'events.emptySubtitle': 'Adicione seu primeiro evento e comece a planejar seu casamento.',
  'events.exportSharingUnavailable': 'O compartilhamento não está disponível neste dispositivo.',
  'events.locationPlaceholder': 'ex. Município',
  'events.guestSidePlaceholder': 'ex. Lado da noiva, Lado do noivo',
  'tabs.seating': 'Mesas',
  'tabs.overview': 'Resumo',
  'overview.yourShare': 'Sua parte',
  'overview.countdownPastHint':
    'Exclua o evento (ícone da lixeira acima) para liberar espaço no seu dispositivo.',
  'overview.countdownNoDate': 'Adicione a data e hora do evento para ver a contagem regressiva.',
  'overview.manageSeating': 'Gerenciar mesas',
  'invitation.hostNamesPlaceholder': 'ex. Ana e Marko',
  'invitation.share': 'Compartilhar',
  'invitation.shareUnavailableWeb': 'Compartilhar está disponível em celulares.',
  'invitation.download': 'Baixar',
  'invitation.downloadUnavailableWeb': 'Baixar para a galeria está disponível em celulares.',
  'invitation.defaults.birthdayHeader': 'Você está convidado a celebrar',
  'invitation.defaults.genericHeader': 'Você está cordialmente convidado',
  'guests.firstName': 'Nome',
  'guests.firstNameRequired': 'O nome é obrigatório.',
  'guests.phone': 'Celular',
  'guests.sides.shared': 'Compartilhado / Neutro',
  'guests.noTablesHintMessage':
    'Ainda não existem mesas para este evento. Adicione mesas na aba Mesas e depois atribua convidados aqui.',
  'seating.title': 'Plano de mesas',
  'seating.hallOverviewHint':
    'Use +/− para zoom. Arraste o salão para mover a vista. Arraste uma mesa para reposicioná-la.',
  'expenses.amount': 'Valor',
  'expenses.amountRequired': 'O valor deve ser maior que 0.',
  'expenses.yourExpense': 'Sua despesa',
  'settings.title': 'Configurações',
  'settings.appTheme': 'Tema do app',
  'settings.appThemeHint': 'Cores para a tela inicial e as configurações.',
  'settings.aboutText':
    'Minha festa perfeita — planeje sua festa localmente no seu dispositivo. Todos os dados ficam no seu dispositivo, com backup por e-mail opcional.',
  'settings.dataStorage': 'Os dados são armazenados localmente no seu dispositivo.',
  'settings.backupTitle': 'Backup por e-mail',
  'settings.backupDescription':
    'Envie um backup dos seus dados para seu e-mail como anexo JSON. Depois de reinstalar o app, baixe o anexo do e-mail e importe aqui.',
  'settings.backupEmailPlaceholder': 'ex. nome@email.com',
  'settings.backupEmailInvalid': 'Digite um endereço de e-mail válido.',
  'settings.backupImportConfirmMessage':
    'Isso substituirá todos os dados existentes do app pelos dados do arquivo de backup.',
  'settings.backupInvalidFile': 'O arquivo selecionado não é um backup válido.',
  'settings.backupMailUnavailable':
    'App de e-mail indisponível. O backup foi compartilhado através do menu de compartilhamento do sistema.',
  'settings.supportDescription': 'Dúvidas, dicas ou um bug? Entre em contato.',
  'settings.supportEmailSubject': 'Minha festa perfeita — suporte',
  'settings.reviewDescription': 'Está gostando do app? Deixe uma avaliação no Google Play.',
  'settings.reviewPromptTitle': 'Está gostando do app?',
  'settings.reviewPromptMessage':
    'Se Minha festa perfeita ajuda você a planejar, uma breve avaliação no Google Play significaria muito.',
  'settings.notificationsHint':
    'Lembretes locais 7 dias, 24 horas e 1 hora antes de cada evento, usando a hora do seu celular.',
  'settings.notificationsInfoMessage':
    'Notificações locais no seu dispositivo.\n\nEventos: 7 dias, 24 horas e 1 hora antes do início (usando a hora do seu celular).\n\nTarefas: 24 horas antes e no horário programado (meio-dia se não houver horário).',
  'settings.usageGuide': 'Como usar o app',
  'settings.termsOfUse': 'Termos de uso',
  'ads.sponsored': 'Anúncio',
  'ads.testHeadline': 'Anúncio de teste',
  'ads.bannerTestSubtitle': 'Prévia de banner de exemplo para Expo Go.',
  'ads.testBody': 'Prévia de anúncio nativo de exemplo para Expo Go.',
  'ads.testCta': 'Instalar',
  'ads.rewardedTitle': 'Anúncio recompensado de teste',
  'ads.rewardedPreviewNote': 'Prévia do Expo — anúncios reais aparecem em builds APK.',
  'ads.rewardedPlaying': 'Reproduzindo anúncio…',
  'ads.rewardedClose': 'Fechar',
  'notifications.event1DayTitle': 'Amanhã é o grande dia',
  'notifications.event1DayBody': '{{eventName}} é amanhã',
  'notifications.eventTodayTitle': 'Hoje é a festa',
  'notifications.eventTodayBody': '{{eventName}} é hoje!',
  'legal.privacy.title': 'Política de privacidade – Minha festa perfeita',
  'legal.privacy.intro':
    'Minha festa perfeita respeita sua privacidade. Esta Política de privacidade explica como suas informações são tratadas quando você usa nosso app.',
  'legal.privacy.localDataBody':
    'Minha festa perfeita não exige uma conta. Seus dados de eventos — incluindo convidados, planos de mesas, despesas, tarefas e notas — são armazenados localmente no seu dispositivo. Não operamos servidores que coletem ou armazenem seus dados pessoais de planejamento, e o desenvolvedor não tem acesso ao seu conteúdo.',
  'legal.privacy.childrenBody':
    'Minha festa perfeita não se destina a coletar informações pessoais de crianças menores de 13 anos. Se você acredita que uma criança forneceu informações pelo app, entre em contato conosco.',
  'legal.privacy.sharingTitle': 'Compartilhamento de dados',
  'legal.privacy.contactBody':
    'Se você tiver dúvidas sobre esta Política de privacidade, entre em contato conosco em {{email}}.',
  'legal.terms.title': 'Termos de uso – Minha festa perfeita',
  'legal.terms.intro': 'Estes Termos de uso regem o uso do app Minha festa perfeita.',
  'legal.terms.acceptanceBody':
    'Ao baixar, instalar ou usar Minha festa perfeita, você concorda com estes Termos de uso. Se não concordar, não use o app.',
  'legal.terms.serviceBody':
    'Minha festa perfeita é um app de planejamento de festas com armazenamento local. Ele ajuda você a gerenciar eventos, listas de convidados, disposição de mesas, despesas, tarefas e detalhes de planejamento relacionados. Os recursos principais funcionam offline e os dados ficam no seu dispositivo.',
  'legal.terms.accountBody':
    'O app não exige criar uma conta ou fazer login. Você é responsável pelas informações que insere e por manter seu dispositivo seguro.',
  'legal.terms.userContentBody':
    'Você é o único responsável pela exatidão e legalidade dos nomes de convidados, contatos, notas e outro conteúdo que adiciona. Não insira informações que você não tenha permissão para armazenar ou compartilhar.',
  'legal.terms.backupBody':
    'Opcionalmente, você pode enviar um backup dos seus dados para seu endereço de e-mail. Você é responsável por proteger os arquivos de backup e restaurar os dados quando necessário. Não nos responsabilizamos por backups perdidos, corrompidos ou inacessíveis.',
  'legal.terms.contactBody':
    'Para dúvidas sobre estes Termos, entre em contato conosco em {{email}}.',
  'legal.ads.invitationTitle': 'Compartilhar ou baixar convites',
  'legal.ads.invitationBody':
    'Compartilhar ou baixar uma imagem de convite pode exigir assistir a um anúncio curto quando você estiver online.',
  'legal.ads.title': 'Anúncios no Minha festa perfeita',
  'legal.ads.intro':
    'A versão gratuita do Minha festa perfeita é financiada por anúncios. Esta página explica onde os anúncios aparecem e quando você pode ser solicitado a assistir a um anúncio recompensado curto.',
  'legal.usage.title': 'Como usar o Minha festa perfeita',
  'legal.usage.intro':
    'Minha festa perfeita ajuda você a planejar uma celebração passo a passo. Este guia explica cada tela e botão para que você saiba exatamente o que cada ação faz.',
  'legal.usage.homeBody':
    'Aqui você vê todos os seus eventos. O ícone de engrenagem (canto superior direito) abre Configurações. O botão azul + (canto inferior direito) cria um novo evento. Toque em um card de evento para abri-lo. O ícone de lápis em um card edita o nome, data, local e tema desse evento.',
  'legal.usage.eventsBody':
    'Digite o nome do evento, data e hora, local e tema da celebração. Você pode adicionar categorias de convidados personalizadas (ex. Família) e lados (ex. Noiva, Noivo). Toque em Salvar para guardar as alterações. Cada evento mantém sua própria lista de convidados, mesas, despesas e tarefas.',
  'legal.usage.tabsBody':
    'Resumo — resumo e ações rápidas. Convidados — lista de convidados e presença. Mesas — mesas e atribuição de lugares. Despesas — orçamento e gráficos. Tarefas — itens a organizar antes da celebração.',
  'legal.usage.eventHeaderBody':
    'Lápis — editar o evento. Ícone de download — exporta um relatório PDF completo (convidados, mesas, despesas, tarefas) para seu dispositivo. Lixeira — exclui todo o evento (confirmação necessária; online pode mostrar um anúncio curto). Na aba Mesas, Ver salão mostra uma planta visual.',
  'legal.usage.overviewTitle': 'Aba Resumo',
  'legal.usage.overviewBody':
    'Contagem regressiva para o evento, gráfico de presença de convidados e estatísticas de mesas e despesas. Criar convite abre o editor de convites. Ações rápidas embaixo: Adicionar convidado, Gerenciar mesas, Adicionar despesa.',
  'legal.usage.guestFormBody':
    'Campos: nome, sobrenome, tamanho do grupo (número de pessoas), celular, categoria, lado e notas. Defina a presença aqui ou depois na lista. Mesa — atribua uma mesa ou deixe sem atribuição. Salvar guarda as alterações. Após cada 30 pessoas no total (online), um anúncio curto pode aparecer antes de adicionar mais.',
  'legal.usage.seatingBody':
    'O card superior mostra lugares ocupados vs livres. Três cards estatísticos filtram a lista de mesas: Mesas totais (todas), Mesas cheias, Mesas disponíveis — toque em um card para filtrar. Convidados não atribuídos aparecem como chips; toque em um chip para atribuir mesa.',
  'legal.usage.hallBody':
    'Ver salão mostra todas as mesas em uma planta. Use +/− para zoom, arraste o salão para mover a vista, arraste uma mesa para reposicioná-la. Na pré-visualização da mesa, Atribuir convidado adiciona alguém a essa mesa; toque em um convidado para removê-lo da mesa.',
  'legal.usage.expensesBody':
    'Valor total e sua parte no topo. Gráficos por categoria abaixo. Toque em uma despesa para editar; a lixeira exclui. + adiciona uma nova despesa (nome, valor, categoria, quem paga).',
  'legal.usage.invitationsBody':
    'Abra a partir do Resumo via Criar convite. Escolha modelo, fonte, cores, texto principal e subeventos (cerimônia, recepção, etc.). Compartilhar envia a imagem; Baixar salva na sua galeria (celular). Online pode mostrar um anúncio curto.',
  'legal.usage.settingsTitle': 'Configurações',
  'legal.usage.settingsBody':
    'Idioma do app, tema do app (pode mostrar anúncio curto ao mudar), notificações com ícone info sobre intervalos de lembrete, e-mail de backup, Enviar backup / Importar backup, avaliar na Play Store, Política de privacidade, Termos de uso, Anúncios no app e este guia.',
  'legal.usage.backupBody':
    'Todos os dados ficam apenas no seu dispositivo. Enviar backup cria um arquivo JSON e abre e-mail ou diálogo de compartilhamento. Importar backup restaura dados de um arquivo salvo anteriormente. Você é responsável por manter seu backup seguro.',
};

function buildLocale(base, globalReplacements, overrides) {
  const entries = flatten(en).map(([key]) => {
    const baseVal = flatten(base).find(([k]) => k === key)?.[1];
    const enVal = flatten(en).find(([k]) => k === key)?.[1];
    let value = baseVal ?? enVal;
    if (typeof value === 'string') {
      value = applyReplacements(value, globalReplacements);
    }
    if (overrides[key] !== undefined) {
      value = overrides[key];
    }
    return [key, value];
  });
  return unflatten(entries);
}

function validate(name, obj) {
  const enKeys = flatten(en).map(([k]) => k).sort();
  const outKeys = flatten(obj).map(([k]) => k).sort();
  const missing = enKeys.filter((k) => !outKeys.includes(k));
  const extra = outKeys.filter((k) => !enKeys.includes(k));
  if (missing.length || extra.length) {
    console.error(`${name}: missing=${missing.length} extra=${extra.length}`);
    if (missing.length) console.error('missing', missing);
    if (extra.length) console.error('extra', extra);
    process.exit(1);
  }
  for (const [key, value] of flatten(en)) {
    const outVal = flatten(obj).find(([k]) => k === key)?.[1];
    if (typeof value === 'string') {
      const placeholders = value.match(/\{\{[^}]+\}\}/g) ?? [];
      for (const ph of placeholders) {
        if (!outVal?.includes(ph)) {
          console.error(`${name}: missing placeholder ${ph} in ${key}`);
          process.exit(1);
        }
      }
    }
  }
  console.log(`${name}: ${outKeys.length} keys OK`);
}

const esMx = buildLocale(es, esMxGlobalReplacements, esMxOverrides);
const ptBr = buildLocale(pt, ptBrGlobalReplacements, ptBrOverrides);

validate('es-mx', esMx);
validate('pt-br', ptBr);

fs.writeFileSync(
  path.join(localesDir, 'es-mx.json'),
  `${JSON.stringify(esMx, null, 2)}\n`,
  'utf8',
);
fs.writeFileSync(
  path.join(localesDir, 'pt-br.json'),
  `${JSON.stringify(ptBr, null, 2)}\n`,
  'utf8',
);

console.log('Wrote locales/es-mx.json and locales/pt-br.json');
