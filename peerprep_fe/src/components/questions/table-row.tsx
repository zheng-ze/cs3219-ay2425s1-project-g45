import TextButton from "@/components/common/text-button";
import Button from "@/components/common/button";
import { deleteQuestion } from "@/app/actions/questions";

export default function TableRow({
  id,
  title,
  difficulty,
  topics,
  onClickEdit,
}: {
  id: string;
  title: string;
  difficulty: string;
  topics: string[];
  onClickEdit: VoidFunction;
}) {
  const token = localStorage.getItem("token");
  const questionLink = title.toLocaleLowerCase().replace(/\s/g, "_");
  const onClickDelete = () => deleteQuestion(id, token);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100">
      <td className="py-3 px-6 text-left whitespace-nowrap font-bold">
        <TextButton text={title} link={`questions/${questionLink}`} />
      </td>
      <td className="py-3 px-6 text-left">{difficulty}</td>
      <td className="py-3 px-6 text-left flex-row">
        {topics.map((topic, index) => {
          return (
            <span
              className="bg-indigo-500 text-white font-bold py-2 my-3 w-fit p-2 m-0.5 rounded-full"
              key={index}
            >
              {topic}
            </span>
          );
        })}
      </td>
      <td className="py-3 px-6 text-left flex flex-row">
        <div className="w-auto px-1">
          <Button type="button" text="Edit" onClick={onClickEdit} />
        </div>
        <div className="w-auto px-1">
          <Button type="button" text="Delete" onClick={onClickDelete} />
        </div>
      </td>
    </tr>
  );
}