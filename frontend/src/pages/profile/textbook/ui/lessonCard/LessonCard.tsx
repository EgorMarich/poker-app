import { useTranslation } from 'react-i18next';

interface LessonCardProps {
  title: string;
  description: string;
  completed: boolean;
}

export const LessonCard = ({ title, sections, description, completed }: LessonCardProps) => {
  const language = useTranslation().i18n.language;
  return (
    <div>
      <h1>{title[language]}</h1>
      <p>{description[language]}</p>
      <p>{completed ? 'Completed' : 'Not completed'}</p>
      {sections.map(section => {
        if (section.type === 'formula') {
          return (
            <>
              <p>{section.content[language]}</p>
              <code>{section.latex_formula}</code>
              <p>
                <strong>Пример:</strong> {section.example[language]}
              </p>
            </>
          );
        }
        if (section.type === 'table') {
          return (
            <table>
              <tr>
                {section.headers[language].map(h => (
                  <th>{h}</th>
                ))}
              </tr>
              {section.rows.map(row => (
                <tr>
                  {row[language].map(cell => (
                    <td>{cell}</td>
                  ))}
                </tr>
              ))}
            </table>
          );
        }
      })}
    </div>
  );
};
