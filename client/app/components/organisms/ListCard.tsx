import ListCardHeader from "../atoms/ListCardHeader";
import ListItem from "../atoms/ListItem";

export interface Item {
  id: number | string;
  name: string;
  slug: string;
  subtitle: string;
  primaryInfo: string;
  secondaryInfo: string;
  image: string;
}

interface ListCardProps {
  title?: string;
  viewAllLink?: string;
  items: Item[];
  itemType?: "product" | "user";
}

export default function ListCard({
  title = "Top Items",
  viewAllLink,
  items = [],
  itemType = "product",
}: ListCardProps) {
  const defaultViewAllLink = itemType === "product" ? "/shop" : "/users";
  const finalViewAllLink = viewAllLink || defaultViewAllLink;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full h-fit">
      <ListCardHeader title={title} viewAllLink={finalViewAllLink} />

      {items.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No items available</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <ListItem key={item.id} item={item} itemType={itemType} />
          ))}
        </div>
      )}
    </div>
  );
}
