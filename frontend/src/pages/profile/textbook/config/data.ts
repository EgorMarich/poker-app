import { type TextbookVersion } from './types';



export const DATA_LESSONS: TextbookVersion[] = [
  {
    version: '1.0',
    language: 'multi',
    lessons: [
      {
        id: 1,
        title: {
          ru: 'Введение в GTO покер',
          en: 'Introduction to GTO Poker',
          es: 'Introducción al póker GTO',
        },
        short_desc: {
          ru: "Что такое Game Theory Optimal и почему это не 'идеальная стратегия'",
          en: "What is Game Theory Optimal and why it's not a 'perfect strategy'",
          es: "Qué es Game Theory Optimal y por qué no es una 'estrategia perfecta'",
        },
        sections: [
          {
            type: 'text',
            content: {
              ru: 'GTO — это стратегия, которую не может эксплуатировать оппонент, даже зная ваши действия. Она балансирует диапазоны: блефы и велью находятся в оптимальной пропорции.',
              en: 'GTO is a strategy that cannot be exploited by an opponent, even if they know your actions. It balances ranges: bluffs and value bets are in an optimal proportion.',
              es: 'GTO es una estrategia que no puede ser explotada por un oponente, incluso si conoce tus acciones. Equilibra rangos: los faroles y las apuestas de valor están en una proporción óptima.',
            },
          },
          {
            type: 'formula',
            title: {
              ru: 'Формула альфа (частота блефа GTO)',
              en: 'Alpha formula (GTO bluff frequency)',
              es: 'Fórmula alfa (frecuencia de farol GTO)',
            },
            content: {
              ru: 'Альфа = размер ставки / (размер ставки + текущий банк). Это минимальный процент рук, которые должен сбросить оппонент, чтобы твой блеф был безубыточен.',
              en: 'Alpha = bet size / (bet size + current pot). This is the minimum percentage of hands the opponent must fold for your bluff to break even.',
              es: 'Alfa = tamaño de la apuesta / (tamaño de la apuesta + bote actual). Este es el porcentaje mínimo de manos que el oponente debe retirar para que tu farol sea rentable.',
            },
            latex_formula: '\\alpha = \\frac{Bet}{Bet + Pot}',
            example: {
              ru: 'Банк $100, ставка $50 → Альфа = 50 / 150 = 0.33 (33%). Если оппонент сбрасывает чаще 33%, блеф прибылен.',
              en: 'Pot $100, bet $50 → Alpha = 50/150 = 0.33 (33%). If opponent folds more than 33%, bluff is profitable.',
              es: 'Bote $100, apuesta $50 → Alfa = 50/150 = 0.33 (33%). Si el oponente se retira más del 33%, el farol es rentable.',
            },
          },
          {
            type: 'formula',
            title: {
              ru: 'MDF (Minimum Defense Frequency)',
              en: 'MDF (Minimum Defense Frequency)',
              es: 'MDF (Frecuencia Mínima de Defensa)',
            },
            content: {
              ru: 'MDF = банк / (банк + ставка). Показывает, как часто нужно коллировать или рейзить, чтобы не дать оппоненту блефовать с любой рукой.',
              en: 'MDF = pot / (pot + bet). Shows how often you must call or raise to prevent your opponent from bluffing with any two cards.',
              es: 'MDF = bote / (bote + apuesta). Muestra con qué frecuencia debes pagar o subir para evitar que el oponente farolee con cualquier par de cartas.',
            },
            latex_formula: 'MDF = \\frac{Pot}{Pot + Bet}',
            example: {
              ru: 'Банк $100, ставка $50 → MDF = 100/150 = 66.7%. Нужно защищать 2 из 3 рук.',
              en: 'Pot $100, bet $50 → MDF = 100/150 = 66.7%. Need to defend 2 out of 3 hands.',
              es: 'Bote $100, apuesta $50 → MDF = 100/150 = 66.7%. Debes defender 2 de cada 3 manos.',
            },
          },
        ],
      },
      {
        id: 2,
        title: {
          ru: 'C-bet на флопе по GTO',
          en: 'GTO C-bet on the flop',
          es: 'C-bet en el flop según GTO',
        },
        short_desc: {
          ru: 'Когда нужно ставить, а когда чекать — частоты для разных текстур',
          en: 'When to bet and when to check — frequencies for different textures',
          es: 'Cuándo apostar y cuándo pasar — frecuencias para diferentes texturas',
        },
        sections: [
          {
            type: 'text',
            content: {
              ru: 'GTO-частоты контбета зависят от текстуры доски. На сухих досках (например, K72 радуга) можно ставить часто — до 70-80% диапазона. На координатных (8♠9♠T♦) частота падает до 40-50%.',
              en: 'GTO c-bet frequencies depend on board texture. On dry boards (e.g., K72 rainbow) you can bet often — up to 70-80% of range. On coordinated boards (8♠9♠T♦) frequency drops to 40-50%.',
              es: 'Las frecuencias de c-bet GTO dependen de la textura del tablero. En tableros secos (p.ej., K72 arcoíris) puedes apostar a menudo — hasta el 70-80% del rango. En tableros coordinados (8♠9♠T♦) la frecuencia baja al 40-50%.',
            },
          },
          {
            type: 'table',
            title: {
              ru: 'Рекомендуемые частоты C-bet (полный потенциал)',
              en: 'Recommended C-bet frequencies (full potential)',
              es: 'Frecuencias de C-bet recomendadas (rango completo)',
            },
            headers: {
              ru: ['Тип доски', 'Частота ставки', 'Размер ставки (от банка)'],
              en: ['Board type', 'Bet frequency', 'Bet size (% pot)'],
              es: ['Tipo de tablero', 'Frecuencia de apuesta', 'Tamaño de apuesta (% bote)'],
            },
            rows: [
              {
                ru: ['Монопольная (A-7-2 радуга)', '75%', '33-50%'],
                en: ['Monotone (A-7-2 rainbow)', '75%', '33-50%'],
                es: ['Monótona (A-7-2 arcoíris)', '75%', '33-50%'],
              },
              {
                ru: ['Координатная (8♠9♠T♦)', '40%', '50-75%'],
                en: ['Coordinated (8♠9♠T♦)', '40%', '50-75%'],
                es: ['Coordinada (8♠9♠T♦)', '40%', '50-75%'],
              },
              {
                ru: ['С высоким флопом (K-Q-J)', '50%', '50%'],
                en: ['High flop (K-Q-J)', '50%', '50%'],
                es: ['Alto (K-Q-J)', '50%', '50%'],
              },
            ],
          },
        ],
      },
      {
        id: 3,
        title: {
          ru: 'Поляризованный диапазон ставки',
          en: 'Polarized betting range',
          es: 'Rango de apuesta polarizado',
        },
        short_desc: {
          ru: 'Сильные руки + блефы, без средней силы',
          en: 'Strong hands + bluffs, no medium strength',
          es: 'Manos fuertes + faroles, sin fuerza media',
        },
        sections: [
          {
            type: 'text',
            content: {
              ru: 'В GTO на ривере диапазон ставки часто поляризован: 70% велью, 30% блефа. Оптимальное соотношение блефов = альфа (см. формулу выше).',
              en: 'In GTO on the river, the betting range is often polarized: 70% value, 30% bluff. Optimal bluff ratio = alpha (see formula above).',
              es: 'En GTO en el river, el rango de apuesta suele estar polarizado: 70% valor, 30% farol. La proporción óptima de faroles = alfa (ver fórmula anterior).',
            },
          },
          {
            type: 'example_hand',
            title: {
              ru: 'Пример: ривер, банк $100',
              en: 'Example: river, pot $100',
              es: 'Ejemplo: river, bote $100',
            },
            content: {
              ru: 'Ты ставишь $50. Альфа = 33% → 33% блефов и 67% велью. Итого: из 100 рук в диапазоне ставки — 67 сильных, 33 блефа.',
              en: 'You bet $50. Alpha = 33% → 33% bluffs and 67% value. Total: out of 100 hands in betting range — 67 strong, 33 bluffs.',
              es: 'Apuestas $50. Alfa = 33% → 33% faroles y 67% valor. Total: de cada 100 manos en el rango de apuesta — 67 fuertes, 33 faroles.',
            },
          },
        ],
      },
    ],
  },
];
