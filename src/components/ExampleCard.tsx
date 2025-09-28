// ExampleCard.tsx
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/Card";

export default function ExampleCard() {
    return (
        <Card className="w-80">
            <CardHeader>
                Profile
            </CardHeader>

            <CardContent>
                <div className="flex items-center space-x-4">
                    <img
                        src="https://i.pravatar.cc/100"
                        alt="Avatar"
                        className="w-12 h-12 rounded-full"
                    />
                    <div>
                        <p className="font-medium">Satoshi</p>
                        <p className="text-sm text-gray-500">Aspiring Fullstack Dev</p>
                    </div>
                </div>
            </CardContent>

            <CardFooter>
                Joined September 2025
            </CardFooter>
        </Card>
    );
}
