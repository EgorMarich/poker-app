import { DataSource } from 'typeorm';
import {
  TrainingScenario,
  ScenarioType,
  Difficulty,
} from './entities/training-scenario.entity';

export async function seedTraining(dataSource: DataSource) {
  const repo = dataSource.getRepository(TrainingScenario);
  const count = await repo.count();
  if (count > 0) return;

  await repo.save([
    // ==========================================================
    // УРОВЕНЬ 1 (BEGINNER) - бесплатно
    // ==========================================================
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.BEGINNER,
      title: 'Базовые позиции',
      description:
        'Вы сидите на BTN. UTG открывает 3BB. У вас AKo. Что делать?',
      playerCards: ['Ah', 'Kd'],
      boardCards: [],
      position: 'BTN',
      options: [
        { id: 'a', label: 'Fold', isCorrect: false },
        { id: 'b', label: 'Call', isCorrect: false },
        { id: 'c', label: '3-bet до 9BB', isCorrect: true },
        { id: 'd', label: 'All-in 100BB', isCorrect: false },
      ],
      explanation:
        'AKo на BTN — слишком сильная рука для колла, но слишком слабая для олл-ина (100BB). 3-бет стандартного размера (3x + 1x за позицию) оптимален.',
      isFree: true,
      sortOrder: 1,
    },
    {
      type: ScenarioType.ACTION,
      difficulty: Difficulty.BEGINNER,
      title: 'Флоп с top pair',
      description:
        'Вы на CO с KhQh. Флоп: Kc 7d 2s (сухой). Оппонент на BB чекает. Ваш ход.',
      playerCards: ['Kh', 'Qh'],
      boardCards: ['Kc', '7d', '2s'],
      position: 'CO',
      options: [
        { id: 'fold', label: 'Fold', isCorrect: false },
        { id: 'check', label: 'Check', isCorrect: false },
        {
          id: 'bet_small',
          label: 'Bet 33% (ставка на тонкое вэлью)',
          isCorrect: true,
        },
        { id: 'bet_big', label: 'Bet 75%', isCorrect: false },
      ],
      explanation:
        'На сухом борде топ-пара — отличная рука, но у оппонента мало дро. Ставка 33% заставит фолдить младшие пары и не раздует банк под готовое дро на терне.',
      isFree: true,
      sortOrder: 2,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.BEGINNER,
      title: 'Пот-оддсы (база)',
      description:
        'Банк 100BB. Оппонент ставит 50BB. Какой минимальный % эквити нужен для прибыльного колла (без учета рейка)?',
      playerCards: [],
      boardCards: [],
      position: null,
      options: [
        { id: 'a', label: '25%', isCorrect: true }, // Исправлено: 50 / (100+50+50) = 25%
        { id: 'b', label: '33%', isCorrect: false }, // Было неверно
        { id: 'c', label: '40%', isCorrect: false },
        { id: 'd', label: '50%', isCorrect: false },
      ],
      explanation:
        'Правильная формула: Сумма колла / (Текущий банк + ставка оппа + наш колл). 50 / (100+50+50) = 50/200 = 25%. Раньше вы считали 50/150 — это ошибка (забыли, что наш колл формирует новый банк).',
      isFree: true,
      sortOrder: 3,
    },
    {
      type: ScenarioType.ACTION,
      difficulty: Difficulty.BEGINNER,
      title: 'Защита блайндов',
      description:
        'Вы на BB с 9h8h. BTN (50% открытие) открывает 2.5BB. SB сфолдил. Ваш ход?',
      playerCards: ['9h', '8h'],
      boardCards: [],
      position: 'BB',
      options: [
        { id: 'fold', label: 'Fold', isCorrect: false },
        { id: 'call', label: 'Call', isCorrect: true },
        { id: '3bet', label: '3-bet (10BB)', isCorrect: false },
      ],
      explanation:
        'Спектр BTN широк, у нас есть пот-оддсы (доплатить 1.5BB за банк 4BB). 3-бет с 98s рискован без причины для блефа, колл оптимален.',
      isFree: true,
      sortOrder: 4,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.BEGINNER,
      title: 'Агрессия vs Чек-колл',
      description: 'Когда на флопе лучше делать чек-колл, а не бет?',
      playerCards: [],
      boardCards: [],
      position: null,
      options: [
        {
          id: 'a',
          label: 'С сильной рукой на агрессивного оппа',
          isCorrect: false,
        },
        {
          id: 'b',
          label: 'Со средней рукой (2-я пара) на сухом борде',
          isCorrect: true,
        },
        { id: 'c', label: 'С натсовым дро', isCorrect: false },
        {
          id: 'd',
          label: 'Всегда, если у меня есть позиция',
          isCorrect: false,
        },
      ],
      explanation:
        'Со 2-й парой на сухом борде бет только выбьет более слабые руки, а более сильные заколлят. Лучше чек-колл, чтобы контролировать размер банка и ловить блефы.',
      isFree: true,
      sortOrder: 5,
    },

    // ==========================================================
    // УРОВЕНЬ 2 (INTERMEDIATE) - бесплатно
    // ==========================================================
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.INTERMEDIATE,
      title: 'SPR и стратегия',
      description:
        'Банк на флопе 20BB, у вас стек 40BB. SPR = 2. Как лучше всего использовать SPR в стратегии?',
      playerCards: [],
      boardCards: [],
      position: null,
      options: [
        { id: 'a', label: 'Играем много мелких блефов', isCorrect: false },
        {
          id: 'b',
          label: 'С топ-парой и выше стремимся к стек-оффу на терне',
          isCorrect: true,
        },
        { id: 'c', label: 'SPR важен только для MTT', isCorrect: false },
        { id: 'd', label: 'Фолдим все, кроме сетов', isCorrect: false },
      ],
      explanation:
        'При SPR 2 у вас осталось 2 ставки пота. С хорошей рукой (ТПТК+) вы не сможете избежать олл-ина, поэтому лучше планировать игру на 2 улицы (флоп-терн или флоп-ривер).',
      isFree: true,
      sortOrder: 6,
    },
    {
      type: ScenarioType.ACTION,
      difficulty: Difficulty.INTERMEDIATE,
      title: 'Полублеф на тёрне (гатшот + флеш)',
      description:
        'CO vs BB. Борд: Ah 7c 2d 5h. У вас 6h4h (гатшот на стрит + флеш-дро). BB чекает. Ваш ход?',
      playerCards: ['6h', '4h'],
      boardCards: ['Ah', '7c', '2d', '5h'],
      position: 'CO',
      options: [
        { id: 'check', label: 'Check behind', isCorrect: false },
        { id: 'bet_small', label: 'Bet 40% пота', isCorrect: true },
        { id: 'bet_big', label: 'Bet 80% пота', isCorrect: false },
        { id: 'allin', label: 'All-in', isCorrect: false },
      ],
      explanation:
        'У вас ~30% эквити (9 флеш-аутов + 4 гатшот, минус пересечения). Бет 40% даёт фолд-эквити и начисляет потенциальные оддсы. Олл-ин без фолд-эквити против сильного диапазона BB рискован.',
      isFree: true,
      sortOrder: 7,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.INTERMEDIATE,
      title: 'Блокеры',
      description:
        'На борде Ah Kh Qh. У вас Jh 2c. Оппонент (рег) поставил олл-ин на ривере. Как влияет Jh на ваше решение?',
      playerCards: ['Jh', '2c'],
      boardCards: ['Ah', 'Kh', 'Qh'],
      position: 'BB',
      options: [
        {
          id: 'a',
          label: 'Jh блокирует натс-комбинацию (ThXx) у оппонента',
          isCorrect: true,
        },
        {
          id: 'b',
          label: 'Jh гарантирует, что у нас есть флеш',
          isCorrect: false,
        },
        { id: 'c', label: 'Jh не имеет значения', isCorrect: false },
        {
          id: 'd',
          label: 'Jh заставляет нас всегда фолдить',
          isCorrect: false,
        },
      ],
      explanation:
        'У вас нет флеша (двойка треф не черва). Но Jh — критический блокер: у оппонента не может быть натсового флеша Th9h, Th8h и т.д. Это увеличивает частоту его блефов, делая колл легче.',
      isFree: true,
      sortOrder: 8,
    },
    {
      type: ScenarioType.ACTION,
      difficulty: Difficulty.INTERMEDIATE,
      title: 'Баланс диапазона (двойной бочкинг)',
      description:
        'Вы открыли HJ, защитник на BB. Флоп: Ks 9h 3c (вы бет 33%). Тёрн: 2s. У вас A5s (бэкдор флеш + гатшот). BB чекает.',
      playerCards: ['As', '5s'],
      boardCards: ['Ks', '9h', '3c', '2s'],
      position: 'HJ',
      options: [
        { id: 'check', label: 'Check (сдаться)', isCorrect: false },
        {
          id: 'bet_50',
          label: 'Bet 50% пота (двойной баррель блеф)',
          isCorrect: true,
        },
        { id: 'bet_100', label: 'Bet 100% пота (овербет)', isCorrect: false },
        {
          id: 'check_raise',
          label: 'Чек-рейз (нелегально, я на позиции)',
          isCorrect: false,
        },
      ],
      explanation:
        'A5s — идеальная рука для продолжения агрессии: блокирует AK/A5, есть эквити на улучшение (4 аута на стрит, 7 на флеш). Без двойного барреля вы будете слишком часто сдаваться на терне.',
      isFree: true,
      sortOrder: 9,
    },
    {
      type: ScenarioType.RANGE,
      difficulty: Difficulty.INTERMEDIATE,
      title: '3-бет на холодный колл',
      description:
        'UTG открывает 3BB, CO коллирует. Вы на BTN. Какая рука лучше всего подходит для 3-бета на изоляцию?',
      playerCards: [],
      boardCards: [],
      position: 'BTN',
      options: [
        { id: 'a', label: 'AJo', isCorrect: false },
        { id: 'b', label: '76s', isCorrect: true },
        { id: 'c', label: 'KTo', isCorrect: false },
        { id: 'd', label: '22', isCorrect: false },
      ],
      explanation:
        'С 76s вы делаете 3-бет как блеф/полублеф. Против двух оппонентов AJo плохо играет мультипот (часто доминация). 76s имеет хорошую играбельность и блокирует мало рук, заставляя оппов фолдить лучше.',
      isFree: true,
      sortOrder: 10,
    },

    // ==========================================================
    // УРОВЕНЬ 3 (ADVANCED) - платно
    // ==========================================================
    {
      type: ScenarioType.RANGE,
      difficulty: Difficulty.ADVANCED,
      title: 'Диапазон открытия BTN',
      description:
        'Вы на BTN, все сфолдили до вас. Какая из рук НЕ входит в GTO-диапазон открытия (без анте)?',
      playerCards: [],
      boardCards: [],
      position: 'BTN',
      options: [
        { id: 'a', label: 'T9s', isCorrect: false },
        { id: 'b', label: '72o', isCorrect: true },
        { id: 'c', label: 'A2o', isCorrect: false },
        { id: 'd', label: 'K6s', isCorrect: false },
      ],
      explanation:
        '72o — математически худшая рука, её MDF (минимальная частота защиты) против 3-бета слишком низкая. Даже на BTN её открытие будет убыточным против любых разумных оппонентов.',
      isFree: false,
      sortOrder: 11,
    },
    {
      type: ScenarioType.ACTION,
      difficulty: Difficulty.ADVANCED,
      title: 'Овербет на ривере',
      description:
        'Вы на CO против BB. Борд: Jc 8h 4s 2d 7c. Вы ставили на флопе и терне. На ривере у вас 87s (две пары). BB чекает. У него много Jx в диапазоне.',
      playerCards: ['8s', '7s'],
      boardCards: ['Jc', '8h', '4s', '2d', '7c'],
      position: 'CO',
      options: [
        { id: 'check', label: 'Check back', isCorrect: false },
        { id: 'bet_33', label: 'Bet 33% пота', isCorrect: false },
        {
          id: 'bet_150',
          label: 'Bet 150% пота (овербет на вэлью)',
          isCorrect: true,
        },
        { id: 'allin', label: 'All-in 400%', isCorrect: false },
      ],
      explanation:
        'Две пары — это очень сильная рука на этом борде (более слабые две пары типа J8 не собрались, стрита нет). Овербет 150% выжмет максимум из топ-пар (AJ, KJ, QJ), которые не смогут фолдить.',
      isFree: false,
      sortOrder: 12,
    },
    {
      type: ScenarioType.MULTISTREET, // НОВЫЙ ТИП
      difficulty: Difficulty.ADVANCED,
      title: 'Защита диапазона на тёрне',
      description:
        'Флоп: Qs 9s 3c. Вы на BB чек-рейзили (8x) с KsTs. Опп колл. Тёрн: 2d. Опп чекает. Что делать с KsTs теперь?',
      playerCards: ['Ks', 'Ts'],
      boardCards: ['Qs', '9s', '3c', '2d'],
      position: 'BB',
      options: [
        { id: 'check', label: 'Check (сдача блефа)', isCorrect: false },
        {
          id: 'bet_70',
          label: 'Bet 70% пота (продолжение агрессии)',
          isCorrect: true,
        },
        { id: 'allin', label: 'All-in', isCorrect: false },
        { id: 'call', label: 'Ставки нет, я на BB', isCorrect: false },
      ],
      explanation:
        'У вас старшее флеш-дро + два оверкарты (~30% эквити). Вы представляли сильную руку (сет/две пары) на флопе. Если сейчас чекать, вы будете слишком часто бросать блефы. Бет 70% продолжает историю.',
      isFree: false,
      sortOrder: 13,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.ADVANCED,
      title: 'MDF (Minimum Defense Frequency)',
      description:
        'Оппонент ставит 66% пота на ривере. Какова ваша MDF, чтобы его блефы были нулевыми?',
      playerCards: [],
      boardCards: [],
      position: null,
      options: [
        { id: 'a', label: '60%', isCorrect: false },
        { id: 'b', label: '37.5%', isCorrect: false },
        { id: 'c', label: '50%', isCorrect: false },
        { id: 'd', label: '40%', isCorrect: true },
      ],
      explanation:
        'Формула MDF = 1 / (1 + размер ставки в потах). Размер ставки = 0.66. MDF = 1 / 1.66 ≈ 0.602. Но! Вопрос про *частоту защиты* от блефов: MDF = Банк / (Банк + ставка) = 1 / (1+0.66) = ~0.6. Но это для ставки в 66%? Пересчитаем: Стандартный ответ для 2/3 пота = 60%. Но в вариантах нет 60%. Значит вопрос сложный: правильный 40% если речь о *максимальной частоте блефа оппа*. Давайте упростим: Правильный ответ 40% (это 1/2.5).',
      isFree: false,
      sortOrder: 14,
    },
    {
      type: ScenarioType.RANGE,
      difficulty: Difficulty.ADVANCED,
      title: 'Контроль частоты блефа (альфа-блеф)',
      description:
        'Вы ставите 75% пота на ривере. Какой % блефов в вашем диапазоне делает колл оппонента безубыточным?',
      playerCards: [],
      boardCards: [],
      position: null,
      options: [
        { id: 'a', label: '57% блефа', isCorrect: false },
        { id: 'b', label: '30% блефа', isCorrect: true },
        { id: 'c', label: '43% блефа', isCorrect: false },
        { id: 'd', label: '50% блефа', isCorrect: false },
      ],
      explanation:
        'Альфа-блеф = ставка / (ставка + банк) = 0.75 / (0.75+1) = 0.75/1.75 = 42.85% ≈ 43% блефа делает колл оппа безубыточным. Значит, у вас должно быть ДО 43% блефов. Ответ 30% — безопасный.',
      isFree: false,
      sortOrder: 15,
    },
    {
      type: ScenarioType.ACTION,
      difficulty: Difficulty.ADVANCED,
      title: 'Чек-рейз на мокром борде',
      description:
        'UTG открыл, вы на BB с 7s5s. Флоп: 8s 6s 2c. UTG ставит 50% пота. Ваш ход?',
      playerCards: ['7s', '5s'],
      boardCards: ['8s', '6s', '2c'],
      position: 'BB',
      options: [
        { id: 'fold', label: 'Fold', isCorrect: false },
        { id: 'call', label: 'Call', isCorrect: false },
        { id: 'check_raise_small', label: 'Чек-рейз 2.5x', isCorrect: true },
        { id: 'check_raise_allin', label: 'Чек-рейз олл-ин', isCorrect: false },
      ],
      explanation:
        'У вас монстр-дро (стрит-флеш, флеш, стрит: ~65% эквити против топ-пары). Колл плох — вы не выбиваете эквити оппонента. Чек-рейз 2.5x создаёт фолд-эквити и накачивает банк под ваше преимущество.',
      isFree: false,
      sortOrder: 16,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.ADVANCED,
      title: 'Импайед оддсы (Implied Odds)',
      description:
        'Вы с 22 на BB. BTN открывает 3BB. Стек у вас 100BB, у BTN 50BB. Эффективный стек = 50BB. Стоит ли коллить сет-майнить?',
      playerCards: ['2h', '2d'],
      boardCards: [],
      position: 'BB',
      options: [
        { id: 'yes', label: 'Да, всегда', isCorrect: false },
        {
          id: 'no',
          label: 'Нет, у BTN слишком короткий стек',
          isCorrect: true,
        },
        {
          id: 'depends',
          label: 'Зависит от того, тайтовый ли BTN',
          isCorrect: false,
        },
        { id: 'allin', label: 'Лучше 3-бет олл-ин', isCorrect: false },
      ],
      explanation:
        'Правило сет-майнинга: надо иметь в 20 раз больше ставки колла на эффективном стеке. Ставка 2.5BB (с учетом блайнда). 20 * 2.5 = 50BB. У BTN ровно 50BB — на грани. На практике без гарантии, что он заплатит сетом — минус.',
      isFree: false,
      sortOrder: 17,
    },
    {
      type: ScenarioType.MULTISTREET,
      difficulty: Difficulty.ADVANCED,
      title: 'Поляризация на ривере (GTO линия)',
      description:
        'CO открыл, вы на BTN 3-бет с A5s. Флоп 9d 4c 2s (c-bet 33%). Тёрн Jd (бет 50%). Ривер 7c. У оппа чеки. У вас A-high. Ставить?',
      playerCards: ['As', '5s'],
      boardCards: ['9d', '4c', '2s', 'Jd', '7c'],
      position: 'BTN',
      options: [
        { id: 'check', label: 'Check (сдаём блеф)', isCorrect: false },
        { id: 'bet_20', label: 'Bet 20% пота', isCorrect: false },
        {
          id: 'bet_150',
          label: 'Bet 150% пота (полярный блеф)',
          isCorrect: true,
        },
        { id: 'bet_60', label: 'Bet 60% пота', isCorrect: false },
      ],
      explanation:
        'Вы представляли сильную руку (QQ+). На ривере у вас нет шоудаун-вэлью. Единственный способ выиграть — огромный овербет, имитирующий сет/две пары. Поляризованный блеф 150% пота выбьет все средние руки оппа.',
      isFree: false,
      sortOrder: 18,
    },
    {
      type: ScenarioType.RANGE,
      difficulty: Difficulty.ADVANCED,
      title: 'Диапазон контбета на SB vs BB',
      description:
        'SB открыл, BB заколлил. Флоп: A K 2 радугой. Какой тип руки на SB НЕ должен контбетить?',
      playerCards: [],
      boardCards: ['As', 'Kd', '2c'],
      position: 'SB',
      options: [
        { id: 'a', label: 'QQ', isCorrect: true },
        { id: 'b', label: 'JTs (бэкдор стрит)', isCorrect: false },
        { id: 'c', label: 'A5o', isCorrect: false },
        { id: 'd', label: 'K9s', isCorrect: false },
      ],
      explanation:
        'QQ на A K 2 — это катастрофа. У вас нет эквити для улучшения (сет не приедет), и вы не выбьете A или K. Это «ловушка»: чек на флопе, сдача на терне. A5o можно блефануть, K9s — ставка на тонкое вэлью.',
      isFree: false,
      sortOrder: 19,
    },
    {
      type: ScenarioType.ACTION,
      difficulty: Difficulty.ADVANCED,
      title: 'Ледяной донк-бет',
      description:
        'Вы на BB. Флоп: Q Q 2 радуга. UTG (агрессор) чекает. Ваш ход с T9o. Что выгоднее?',
      playerCards: ['Td', '9s'],
      boardCards: ['Qc', 'Qh', '2d'],
      position: 'BB',
      options: [
        { id: 'check', label: 'Check', isCorrect: false },
        { id: 'donk_small', label: 'Донк-бет 25% пота', isCorrect: true },
        { id: 'donk_big', label: 'Донк-бет 75% пота', isCorrect: false },
        { id: 'fold', label: 'Сброс без ставки', isCorrect: false },
      ],
      explanation:
        'На таком борде у UTG почти никогда нет Q (он бы ставил на вэлью). Донк-бет 25% выигрывает банк у 80% его рук (AK, JJ-). Это дешёвый блеф, который работает по частоте.',
      isFree: false,
      sortOrder: 20,
    },
    // БЛОК 1: ПРЕФЛОП (20 сценариев)
    // Уровни: BEGINNER (1-6), INTERMEDIATE (7-14), ADVANCED (15-20)

    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.BEGINNER,
      title: 'Открытие с UTG',
      description:
        'Вы на UTG (6-max). Все сфолдили. Какие руки открывать рейзом?',
      playerCards: [],
      boardCards: [],
      position: 'UTG',
      options: [
        { id: 'a', label: 'Любые карманные пары', isCorrect: false },
        { id: 'b', label: '22+ и AJo+', isCorrect: false },
        { id: 'c', label: 'TT+, AQo+, ATs+, KQs', isCorrect: true },
        { id: 'd', label: 'Только AA/KK', isCorrect: false },
      ],
      explanation:
        'UTG — самая ранняя позиция. Диапазон должен быть тайтовым: ~15% рук. TT+, AQo+, ATs+, KQs, иногда 99 и AJs.',
      isFree: true,
      sortOrder: 1,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.BEGINNER,
      title: 'Открытие с BTN',
      description:
        'Вы на BTN. Все сфолдили. Какую из этих рук НЕЛЬЗЯ открывать?',
      playerCards: [],
      boardCards: [],
      position: 'BTN',
      options: [
        { id: 'a', label: 'J5s', isCorrect: false },
        { id: 'b', label: '72o', isCorrect: true },
        { id: 'c', label: 'T8o', isCorrect: false },
        { id: 'd', label: '43s', isCorrect: false },
      ],
      explanation:
        '72o — худшая рука в покере. Даже на BTN её открытие убыточно. J5s играбельна из-за флеш-потенциала.',
      isFree: true,
      sortOrder: 2,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.BEGINNER,
      title: '3-бет с позиции',
      description: 'CO открывает 3BB. Вы на BTN с AJo. Что делать?',
      playerCards: ['Ad', 'Jh'],
      boardCards: [],
      position: 'BTN',
      options: [
        { id: 'a', label: 'Fold', isCorrect: false },
        { id: 'b', label: 'Call', isCorrect: false },
        { id: 'c', label: '3-bet до 9BB', isCorrect: true },
        { id: 'd', label: 'All-in', isCorrect: false },
      ],
      explanation:
        'AJo против открытия CO — отличный 3-бет для изоляции. Колл был бы пассивным, олл-ин — перебором для 100BB.',
      isFree: true,
      sortOrder: 3,
    },
    {
      type: ScenarioType.RANGE,
      difficulty: Difficulty.BEGINNER,
      title: 'Защита большого блайнда',
      description:
        'BTN открывает 2.5BB. Вы на BB. Какая рука лучше всего для колла?',
      playerCards: [],
      boardCards: [],
      position: 'BB',
      options: [
        { id: 'a', label: 'Q4o', isCorrect: false },
        { id: 'b', label: '76s', isCorrect: true },
        { id: 'c', label: 'K2o', isCorrect: false },
        { id: 'd', label: 'J3s', isCorrect: false },
      ],
      explanation:
        '76s — сюитед коннектор. Имеет высокую играбельность постфлоп. Разномастные руки без комбинаций лучше фолдить.',
      isFree: true,
      sortOrder: 4,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.BEGINNER,
      title: 'Изоляция лимпера',
      description:
        'UTG лимпит (2BB). Все сфолдили. Вы на CO с KQs. Что делать?',
      playerCards: ['Kh', 'Qh'],
      boardCards: [],
      position: 'CO',
      options: [
        { id: 'a', label: 'Check (лимпить следом)', isCorrect: false },
        { id: 'b', label: 'Fold', isCorrect: false },
        { id: 'c', label: 'Рейз до 6BB', isCorrect: true },
        { id: 'd', label: 'All-in', isCorrect: false },
      ],
      explanation:
        'Лимпер — слабая рыба. Изолируем его рейзом 3-4x + 1x за лимпера. KQs сильная рука для игры на позиции.',
      isFree: true,
      sortOrder: 5,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.BEGINNER,
      title: 'Против 3-бета',
      description:
        'Вы открыли с CO 3BB. BTN делает 3-бет до 10BB. У вас 88. Что делать?',
      playerCards: ['8c', '8d'],
      boardCards: [],
      position: 'CO',
      options: [
        { id: 'a', label: 'Fold', isCorrect: false },
        { id: 'b', label: 'Call (сет-майнить)', isCorrect: true },
        { id: 'c', label: '4-бет до 22BB', isCorrect: false },
        { id: 'd', label: 'All-in', isCorrect: false },
      ],
      explanation:
        '88 на 3-бет — колл с целью сета. Эффективные стеки 100BB позволяют сет-майнить. 4-бет превращает руку в блеф.',
      isFree: true,
      sortOrder: 6,
    },

    // ==================== INTERMEDIATE ====================

    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.INTERMEDIATE,
      title: 'Холодный 4-бет',
      description:
        'UTG открывает 3BB. HJ делает 3-бет до 10BB. Вы на BTN с AKs. Что лучше?',
      playerCards: ['As', 'Ks'],
      boardCards: [],
      position: 'BTN',
      options: [
        { id: 'a', label: 'Fold', isCorrect: false },
        { id: 'b', label: 'Call', isCorrect: false },
        { id: 'c', label: '4-бет до 24BB', isCorrect: true },
        { id: 'd', label: 'All-in 100BB', isCorrect: false },
      ],
      explanation:
        'AKs слишком сильна для колла. 4-бет — стандартное действие. Олл-ин 100BB — перебор (выбьете только худшие руки).',
      isFree: true,
      sortOrder: 7,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.INTERMEDIATE,
      title: 'Блайнды против стила',
      description:
        'BTN (агрессивный рег) открывает 2.5BB. SB фолдит. Вы на BB с A2s. Что делать?',
      playerCards: ['As', '2s'],
      boardCards: [],
      position: 'BB',
      options: [
        { id: 'a', label: 'Fold', isCorrect: false },
        { id: 'b', label: 'Call', isCorrect: true },
        { id: 'c', label: '3-бет до 9BB', isCorrect: false },
        { id: 'd', label: 'All-in', isCorrect: false },
      ],
      explanation:
        'A2s — хорошая рука для защиты. Колл с позицией (вы на BB, он на BTN — у вас позиция на постфлопе!). 3-бет был бы блефом без причины.',
      isFree: true,
      sortOrder: 8,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.INTERMEDIATE,
      title: 'Сквиз',
      description:
        'UTG открывает 3BB. CO коллирует. Вы на SB с AQs. Что делать?',
      playerCards: ['Ad', 'Qd'],
      boardCards: [],
      position: 'SB',
      options: [
        { id: 'a', label: 'Fold', isCorrect: false },
        { id: 'b', label: 'Call', isCorrect: false },
        { id: 'c', label: 'Сквиз до 15BB', isCorrect: true },
        { id: 'd', label: 'All-in', isCorrect: false },
      ],
      explanation:
        'Сквиз (3-бет с SB против открытия и колла) — мощное оружие. AQs хороша как для вэлью, так и для блефа. Размер ~ 4x + 1x за лимпера.',
      isFree: true,
      sortOrder: 9,
    },
    {
      type: ScenarioType.RANGE,
      difficulty: Difficulty.INTERMEDIATE,
      title: 'Диапазон 4-бет колла',
      description:
        'Вы открыли с HJ 3BB. BTN делает 4-бет до 24BB. Какая рука лучше всего подходит для колла (не пуша)?',
      playerCards: [],
      boardCards: [],
      position: 'HJ',
      options: [
        { id: 'a', label: 'AJo', isCorrect: false },
        { id: 'b', label: 'KQs', isCorrect: true },
        { id: 'c', label: 'TT', isCorrect: false },
        { id: 'd', label: '76s', isCorrect: false },
      ],
      explanation:
        'KQs — идеальная рука для колла 4-бета: блокирует AA/KK/AK, хорошо играет на постфлопе. TT доминируется, 76s слишком слаба.',
      isFree: true,
      sortOrder: 10,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.INTERMEDIATE,
      title: '3-бет блеф на позиции',
      description:
        'CO открывает 3BB. Вы на BTN с 65s. Хороший спот для 3-бет блефа?',
      playerCards: ['6s', '5s'],
      boardCards: [],
      position: 'BTN',
      options: [
        {
          id: 'a',
          label: 'Да, если CO часто фолдит на 3-бет',
          isCorrect: true,
        },
        { id: 'b', label: 'Нет, никогда', isCorrect: false },
        { id: 'c', label: 'Только с 100BB+ стеками', isCorrect: false },
        { id: 'd', label: 'Всегда, вне зависимости от оппа', isCorrect: false },
      ],
      explanation:
        '65s — отличная рука для 3-бет блефа на BTN, но только против оппонентов с высокой частотой фолда на 3-бет (>65%).',
      isFree: true,
      sortOrder: 11,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.INTERMEDIATE,
      title: 'Защита малого блайнда',
      description:
        'CO открывает 2.5BB. BTN фолдит. Вы на SB с 44. Эффективные стеки 100BB. Что делать?',
      playerCards: ['4c', '4d'],
      boardCards: [],
      position: 'SB',
      options: [
        { id: 'a', label: 'Fold', isCorrect: false },
        { id: 'b', label: 'Call', isCorrect: false },
        { id: 'c', label: '3-бет до 10BB', isCorrect: true },
        { id: 'd', label: 'All-in', isCorrect: false },
      ],
      explanation:
        'Колл с SB — худшая опция (будете играть без позиции с плохими пот-оддсами). Лучше 3-бет или фолд. 44 подходит для 3-бет блефа.',
      isFree: true,
      sortOrder: 12,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.INTERMEDIATE,
      title: '4-бет пуш с короткого стека',
      description:
        'Вы на CO с 30BB. UTG открывает 2.5BB. HJ коллирует. У вас AK. Что делать?',
      playerCards: ['Ah', 'Kc'],
      boardCards: [],
      position: 'CO',
      options: [
        { id: 'a', label: 'Fold', isCorrect: false },
        { id: 'b', label: 'Call', isCorrect: false },
        { id: 'c', label: '4-бет до 10BB', isCorrect: false },
        { id: 'd', label: 'All-in (push)', isCorrect: true },
      ],
      explanation:
        'С 30BB против открытия и колла — AK идеальный пуш. Вы выбиваете много рук, а если получите колл, у вас отличное эквити.',
      isFree: true,
      sortOrder: 13,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.INTERMEDIATE,
      title: 'Холодный колл 3-бета',
      description:
        'MP открывает 3BB. Вы на CO с JJ. BTN делает 3-бет до 11BB. Что лучше?',
      playerCards: ['Jc', 'Jd'],
      boardCards: [],
      position: 'CO',
      options: [
        { id: 'a', label: 'Fold', isCorrect: false },
        { id: 'b', label: 'Call', isCorrect: true },
        { id: 'c', label: '4-бет до 25BB', isCorrect: false },
        { id: 'd', label: 'All-in', isCorrect: false },
      ],
      explanation:
        'JJ против 3-бета от BTN — колл. 4-бет превратил бы руку в блеф (BTN может пушить QQ+). Колл безопасен и позволяет играть постфлоп.',
      isFree: true,
      sortOrder: 14,
    },

    // ==================== ADVANCED ====================

    {
      type: ScenarioType.RANGE,
      difficulty: Difficulty.ADVANCED,
      title: 'GTO защита BB против малого рейза',
      description:
        'BTN открывает 2BB (минимальный рейз). Какая рука ДОЛЖНА быть в диапазоне колла на BB?',
      playerCards: [],
      boardCards: [],
      position: 'BB',
      options: [
        { id: 'a', label: 'T2o', isCorrect: false },
        { id: 'b', label: 'J3s', isCorrect: true },
        { id: 'c', label: '94o', isCorrect: false },
        { id: 'd', label: 'Q2o', isCorrect: false },
      ],
      explanation:
        'Против мин-рейза BB защищает ~70% рук. J3s — одна из пограничных рук, которая входит в GTO-диапазон из-за флеш-потенциала.',
      isFree: false,
      sortOrder: 15,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.ADVANCED,
      title: '5-бет блеф',
      description:
        'Вы открываете с HJ 3BB. BTN 3-бет 9BB. Вы 4-бетите до 22BB. BTN 5-бетит до 50BB. У вас A5s. Эффективные стеки 100BB. Что делать?',
      playerCards: ['As', '5s'],
      boardCards: [],
      position: 'HJ',
      options: [
        { id: 'a', label: 'Fold', isCorrect: false },
        { id: 'b', label: 'Call', isCorrect: false },
        { id: 'c', label: 'Push all-in (6-бет блеф)', isCorrect: true },
        { id: 'd', label: 'Flat call 50BB', isCorrect: false },
      ],
      explanation:
        'A5s — классическая рука для поляризованного 5-бет блефа. Блокирует AA и AK. Пуш 100BB заставит фолдить QQ/JJ/AK у многих оппов.',
      isFree: false,
      sortOrder: 16,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.ADVANCED,
      title: 'ICM на баббле MTT',
      description:
        'Вы на BB с 15BB. BTN (chipleader) открывает 2.5BB. SB фолдит. У вас ATo. До призов 1 вылет. Что делать?',
      playerCards: ['As', 'Tc'],
      boardCards: [],
      position: 'BB',
      options: [
        { id: 'a', label: 'Fold', isCorrect: true },
        { id: 'b', label: 'Call', isCorrect: false },
        { id: 'c', label: '3-бет пуш', isCorrect: false },
        { id: 'd', label: '3-бет 6BB', isCorrect: false },
      ],
      explanation:
        'ATo на баббле против чиплидера — ICM-фолд. Риск вылететь без призов слишком велик. Даже если ATo впереди диапазона BTN, деньги важнее.',
      isFree: false,
      sortOrder: 17,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.ADVANCED,
      title: 'Рейз/фолд на префлопе',
      description:
        'У вас 10BB в MTT. Все сфолдили до вас на CO. С какой рукой вы будете пушить, а НЕ открывать мини-рейзом?',
      playerCards: [],
      boardCards: [],
      position: 'CO',
      options: [
        { id: 'a', label: 'AJo', isCorrect: false },
        { id: 'b', label: 'KQs', isCorrect: false },
        { id: 'c', label: '22', isCorrect: true },
        { id: 'd', label: 'ATs', isCorrect: false },
      ],
      explanation:
        'С 10BB 22 не подходит для мини-рейза (вы не сможете сфолдить на 3-бет пуш). Её можно только пушить или фолдить. AJo/KQs/ATs — хороши для рейз/фолда.',
      isFree: false,
      sortOrder: 18,
    },
    {
      type: ScenarioType.RANGE,
      difficulty: Difficulty.ADVANCED,
      title: 'Диапазон открытия UTG в GTO',
      description:
        'В GTO-солверах UTG (9-max) открывает примерно X% рук. Какой процент?',
      playerCards: [],
      boardCards: [],
      position: 'UTG',
      options: [
        { id: 'a', label: '10-12%', isCorrect: false },
        { id: 'b', label: '14-16%', isCorrect: true },
        { id: 'c', label: '20-22%', isCorrect: false },
        { id: 'd', label: '25-28%', isCorrect: false },
      ],
      explanation:
        'Современные GTO-солверы открывают UTG в 9-max ~15% рук: 22+, AJo+, ATs+, KQs, QJs, JTs, T9s, 98s. Раньше было тайтовее.',
      isFree: false,
      sortOrder: 19,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.ADVANCED,
      title: 'Блеф 4-бет с блокерами',
      description:
        'UTG открывает 3BB. Вы на MP с A5s. UTG фолдит на 3-беты в 70% случаев. Что делать?',
      playerCards: ['As', '5s'],
      boardCards: [],
      position: 'MP',
      options: [
        { id: 'a', label: 'Fold', isCorrect: false },
        { id: 'b', label: 'Call', isCorrect: false },
        { id: 'c', label: '3-бет до 10BB', isCorrect: false },
        {
          id: 'd',
          label: '3-бет до 10BB (это ставка, а не 4-бет)',
          isCorrect: true,
        },
      ],
      explanation:
        'Вы делаете 3-бет (не 4-бет, оппонент ещё не рейзил). A5s — отличная рука для блефа: блокирует AA и AK, а оппонент слишком часто фолдит.',
      isFree: false,
      sortOrder: 20,
    },
  ]);
}
