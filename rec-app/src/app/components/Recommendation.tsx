import Image from "next/image";
import { Star } from "lucide-react";
// all parameters that can be passed to the board component
type RecProps = {
    id: string;
    board_id: string;
    name: string;
    description: string;
    comment: string;
    rating: string;
    thumbnail?: string;
};
export default function Recommendation({id,board_id,name, description, comment, rating, thumbnail}:RecProps){
    return(
        <div
        key={id}
        className="bg-white border rounded-2xl shadow-sm p-4 hover:shadow-md transition"
        >
            {thumbnail ? (
                <div className="aspect-video mb-4 relative rounded-lg overflow-hidden">
                <Image
                    src={thumbnail}
                    alt={name}
                    fill
                    className="object-cover"
                />
                </div>
            ) : (
                <div className="aspect-video mb-4 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                No Image
                </div>
            )}
            <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            <div className="flex items-center gap-1 mt-2 text-yellow-500">
                <Star className="w-4 h-4 fill-yellow-400" />
                <span className="text-sm font-medium">{rating}/10</span>
            </div>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                "{comment}"
            </p>
        </div>
    )
}