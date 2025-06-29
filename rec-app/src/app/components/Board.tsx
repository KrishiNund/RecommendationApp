import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type BoardProps = {
  name: string;
  description: string;
  category: string;
};

export default function Board({ name, description, category }: BoardProps){
    return(
       <Card>
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <p>{category}</p>
            </CardFooter>
        </Card>
    )
}