/** Сценарий на водената обиколка с мечето Комсе. */

export type Mood = 'happy' | 'talking' | 'wave' | 'point' | 'cheer';

export type TourStep = {
  path: string; // на коя страница е стъпката
  selector?: string; // кой елемент да се освети (по желание)
  title: string;
  text: string;
  mood: Mood;
  demoSql?: string; // ако е зададено — турът сам въвежда и изпълнява тази заявка
  demoForm?: boolean; // ако е true — турът сам попълва формата за нов продукт
  durationMs?: number; // персонализирано време за авто-прелистване
  dim?: boolean; // затъмнение на фона (по подразбиране true)
};

export const TOUR_STEPS: TourStep[] = [
  {
    path: '/',
    title: 'Здравей! 🧸',
    text: 'Аз съм Комсе — талисманът на магазина! Ще те разведа из целия сайт. Облегни се назад и гледай, аз поемам кормилото!',
    mood: 'wave',
  },
  {
    path: '/',
    selector: '[data-tour="stats"]',
    title: 'Началният панел',
    text: 'Тук виждаш живата статистика — брой продукти, категории, клиенти и поръчки. Числата идват директно от базата данни!',
    mood: 'point',
  },
  {
    path: '/',
    selector: '[data-tour="tiles"]',
    title: 'Бърз достъп',
    text: 'Тези плочки те водят с един клик до всяка част на магазина. Но няма нужда — аз ще те разведа навсякъде!',
    mood: 'happy',
  },
  {
    path: '/products',
    selector: '[data-tour="list"]',
    title: 'Продукти',
    text: 'Това е целият каталог: цени, промо цени, наличност и марка. Зелено = много на склад, червено = изчерпано.',
    mood: 'point',
  },
  {
    path: '/products',
    selector: '[data-tour="add"]',
    title: 'Добавяне на продукт',
    text: 'С този бутон добавяш нов продукт. Чакай, ще ти покажа как става — да отворим формата!',
    mood: 'talking',
  },
  {
    path: '/products/new',
    title: 'Гледай как попълвам! 🧸',
    text: 'Попълвам формата за нов продукт вместо теб — име, SKU, цена, наличност... Накрая просто натискаш „Запази" и продуктът влиза в базата! (Аз само показвам — не записвам нищо.)',
    mood: 'cheer',
    dim: false,
    durationMs: 13000,
    demoForm: true,
  },
  {
    path: '/categories',
    selector: '[data-tour="list"]',
    title: 'Категории',
    text: 'Категориите са в йерархия — една категория може да има родителска. Виждаш и колко продукта има във всяка.',
    mood: 'point',
  },
  {
    path: '/customers',
    selector: '[data-tour="list"]',
    title: 'Клиенти',
    text: 'Всички клиенти, заедно с броя на поръчките им. И тук можеш да добавяш нови — с проверка за уникален имейл.',
    mood: 'happy',
  },
  {
    path: '/orders',
    selector: '[data-tour="list"]',
    title: 'Поръчки',
    text: 'Поръчките с техния статус, сума и начин на плащане/доставка. Сега ще отворя една, за да видиш детайлите!',
    mood: 'talking',
  },
  {
    path: '/orders/1',
    selector: '[data-tour="order-items"]',
    title: 'Детайл на поръчка',
    text: 'Ето всички артикули в поръчката — това е JOIN между четири таблици: поръчки, клиенти, артикули и продукти. Истинска релационна магия! ✨',
    mood: 'cheer',
  },
  {
    path: '/promotions',
    selector: '[data-tour="list"]',
    title: 'Промоции',
    text: 'Активните и изтеклите промоции, с период и процент отстъпка. Всяка промоция може да важи за много продукти.',
    mood: 'point',
  },
  {
    path: '/sql',
    selector: '[data-tour="sql-examples"]',
    title: 'SQL конзола 💻',
    text: 'Това е любимата ми част! Натисни някой от тези бутони и ще се зареди готова заявка — например „Топ 3 клиенти".',
    mood: 'cheer',
  },
  {
    path: '/sql',
    title: 'Гледай сега! 🪄',
    text: 'Ще напиша заявка за топ клиентите и ще я изпълня вместо теб — гледай как резултатите се появяват на живо отдолу!',
    mood: 'cheer',
    dim: false,
    durationMs: 13000,
    demoSql: `SELECT cu.first_name || ' ' || cu.last_name AS клиент,
       COUNT(o.order_id) AS поръчки, SUM(o.total) AS похарчено
FROM customer cu
JOIN orders o ON cu.customer_id = o.customer_id
WHERE o.status = 'delivered'
GROUP BY cu.first_name, cu.last_name
ORDER BY похарчено DESC`,
  },
  {
    path: '/',
    title: 'Това беше! 🎉',
    text: 'Това беше обиколката на КОМСЕД! Сега опознаваш целия сайт. Можеш да я пуснеш пак по всяко време от бутона в менюто. Чао! 👋',
    mood: 'wave',
  },
];
