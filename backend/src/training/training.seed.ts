import { DataSource } from 'typeorm'
import { TrainingScenario, ScenarioType, Difficulty } from './entities/training-scenario.entity'

export async function seedTraining(dataSource: DataSource) {
  const repo = dataSource.getRepository(TrainingScenario)
  const count = await repo.count()
  if (count > 0) return // уже засеяно

  await repo.save([
    // ── Уровень 1 (бесплатно) ──────────────────────────────
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.BEGINNER,
      title: 'Базовые позиции',
      description: 'Вы сидите на BTN. UTG открывает 3BB. У вас AKo. Что делать?',
      playerCards: ['Ah', 'Kd'],
      boardCards: [],
      position: 'BTN',
      options: [
        { id: 'a', label: 'Fold', isCorrect: false },
        { id: 'b', label: 'Call', isCorrect: false },
        { id: 'c', label: '3-bet до 9BB', isCorrect: true },
        { id: 'd', label: 'All-in', isCorrect: false },
      ],
      explanation: 'AKo на BTN против UTG open — стандартный 3-bet. Рука слишком сильная для колла, позиция позволяет давить давление.',
      isFree: true,
      sortOrder: 1,
    },
    {
      type: ScenarioType.ACTION,
      difficulty: Difficulty.BEGINNER,
      title: 'Флоп с top pair',
      description: 'Вы на CO с KhQh. Флоп: Kc 7d 2s. Оппонент чекает. Ваш ход.',
      playerCards: ['Kh', 'Qh'],
      boardCards: ['Kc', '7d', '2s'],
      position: 'CO',
      options: [
        { id: 'fold', label: 'Fold', isCorrect: false },
        { id: 'check', label: 'Check', isCorrect: false },
        { id: 'bet_small', label: 'Bet 33%', isCorrect: true },
        { id: 'bet_big', label: 'Bet 75%', isCorrect: false },
      ],
      explanation: 'Сухой борд с top pair top kicker — стандартный small bet для защиты и набора ценности. Большая ставка не нужна, борд хорошо для нашего диапазона.',
      isFree: true,
      sortOrder: 2,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.BEGINNER,
      title: 'Пот-оддсы',
      description: 'Банк 100BB. Оппонент ставит 50BB. Какой минимальный % эквити нужен для профитного колла?',
      playerCards: [],
      boardCards: [],
      position: null,
      options: [
        { id: 'a', label: '25%', isCorrect: false },
        { id: 'b', label: '33%', isCorrect: true },
        { id: 'c', label: '40%', isCorrect: false },
        { id: 'd', label: '50%', isCorrect: false },
      ],
      explanation: 'Считаем: колл 50BB в банк 150BB = 50/150 = 33%. Если у нас больше 33% эквити — колл профитный.',
      isFree: true,
      sortOrder: 3,
    },

    // ── Уровень 2 (бесплатно) ──────────────────────────────
    {
      type: ScenarioType.ACTION,
      difficulty: Difficulty.BEGINNER,
      title: 'Защита блайндов',
      description: 'Вы на BB с 9h8h. BTN открывает 2.5BB. Все сфолдили. Что делать?',
      playerCards: ['9h', '8h'],
      boardCards: [],
      position: 'BB',
      options: [
        { id: 'fold', label: 'Fold', isCorrect: false },
        { id: 'call', label: 'Call', isCorrect: true },
        { id: '3bet', label: '3-bet', isCorrect: false },
      ],
      explanation: '9h8h на BB против BTN open — стандартный колл. Хорошие пот-оддсы (доплачиваем 1.5BB в уже имеющийся 1BB), сюитед коннектор играет хорошо постфлоп.',
      isFree: true,
      sortOrder: 4,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.INTERMEDIATE,
      title: 'SPR и стратегия',
      description: 'Банк на флопе 20BB, у вас стек 40BB. SPR = 2. Как это влияет на стратегию?',
      playerCards: [],
      boardCards: [],
      position: null,
      options: [
        { id: 'a', label: 'Играем осторожно, много блефуем', isCorrect: false },
        { id: 'b', label: 'Готовимся к олл-ину с любой сильной рукой', isCorrect: true },
        { id: 'c', label: 'SPR не влияет на стратегию', isCorrect: false },
        { id: 'd', label: 'Всегда фолдим при давлении', isCorrect: false },
      ],
      explanation: 'При SPR = 2 стек уходит очень быстро. Если попали в сильную руку (топ пара+) — готовимся к олл-ину. Нет смысла складывать маленькие ставки.',
      isFree: true,
      sortOrder: 5,
    },

    // ── Уровень 3 (платно) ─────────────────────────────────
    {
      type: ScenarioType.ACTION,
      difficulty: Difficulty.INTERMEDIATE,
      title: 'Полублеф на тёрне',
      description: 'CO vs BB. Борд: Ah 7c 2d. Тёрн: 5h. У вас 6h4h (gut shot + backdoor flush). BB чекает.',
      playerCards: ['6h', '4h'],
      boardCards: ['Ah', '7c', '2d', '5h'],
      position: 'CO',
      options: [
        { id: 'check', label: 'Check behind', isCorrect: false },
        { id: 'bet_small', label: 'Bet 40%', isCorrect: true },
        { id: 'bet_big', label: 'Bet 80%', isCorrect: false },
        { id: 'allin', label: 'All-in', isCorrect: false },
      ],
      explanation: 'Отличный полублеф: gut shot даёт 4 аута на стрит, flush draw ещё +. Ставка 40% пота — хороший баланс давления и pot odds для продолжения.',
      isFree: false,
      sortOrder: 6,
    },
    {
      type: ScenarioType.QUIZ,
      difficulty: Difficulty.INTERMEDIATE,
      title: 'Блокеры',
      description: 'На борде AhKhQh. У вас Jh. Оппонент поставил олл-ин. Как Jh влияет на ваше решение?',
      playerCards: ['Jh', '2c'],
      boardCards: ['Ah', 'Kh', 'Qh'],
      position: 'BB',
      options: [
        { id: 'a', label: 'Jh блокирует натс у оппонента (Th)', isCorrect: true },
        { id: 'b', label: 'Jh делает вашу руку сильнее', isCorrect: false },
        { id: 'c', label: 'Jh не имеет значения', isCorrect: false },
        { id: 'd', label: 'Jh всегда повод для фолда', isCorrect: false },
      ],
      explanation: 'Jh — блокер на Th, который нужен оппоненту для royal flush и натс. Это увеличивает вероятность что оппонент блефует, делая колл более привлекательным.',
      isFree: false,
      sortOrder: 7,
    },
    {
      type: ScenarioType.RANGE,
      difficulty: Difficulty.ADVANCED,
      title: 'Диапазон открытия BTN',
      description: 'Вы на BTN, все сфолдили до вас. Какая из рук НЕ входит в стандартный open-raise диапазон?',
      playerCards: [],
      boardCards: [],
      position: 'BTN',
      options: [
        { id: 'a', label: 'T9s', isCorrect: false },
        { id: 'b', label: '72o', isCorrect: true },
        { id: 'c', label: 'A2s', isCorrect: false },
        { id: 'd', label: 'K8o', isCorrect: false },
      ],
      explanation: '72o — самая слабая рука в покере, не входит ни в один стандартный диапазон открытия даже на BTN. Остальные руки играются с BTN.',
      isFree: false,
      sortOrder: 8,
    },
  ])
}