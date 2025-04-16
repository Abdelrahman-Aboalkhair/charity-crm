import Link from "next/link";

const ListCardHeader: React.FC<{ title: string; viewAllLink: string }> = ({
  title,
  viewAllLink,
}) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="font-semibold text-lg text-gray-800">{title}</h2>
    <Link
      href={viewAllLink}
      className="text-gray-500 text-sm hover:text-gray-700 flex items-center transition-colors duration-200"
    >
      View All
    </Link>
  </div>
);

export default ListCardHeader;
